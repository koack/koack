import { EventEmitter } from 'events';
import { RTMClient, WebClient } from '@slack/client';
import Logger from 'nightingale-logger';
import compose from 'koa-compose';
import { INTERACTIVE_MESSAGE_RESPONSE } from 'koack-symbols';
import createContextFromBot from './context/createContextFromBot';
import createContextFromEvent from './context/createContextFromEvent';
import createContextFromHttp from './context/createContextFromInteractiveMessageResponse';
import { BotContext, BotMiddleware, Team } from './types';

export interface BotConstructorData {
  team?: Team;
  rtm: RTMClient;
  webClient: WebClient;
  installerUsersWebClients: null | Map<string, WebClient>;
}

const logger = new Logger('koack:bot');

export default class Bot {
  team?: Team;
  rtm: RTMClient;
  webClient: WebClient;
  installerUsersWebClients: null | Map<string, WebClient>;
  middlewares: Array<BotMiddleware> = [];
  /** bot id in the team */
  id?: string;
  /** bot name in the team */
  name?: string;
  internalEventEmitter = new EventEmitter();

  _ctx: BotContext;

  constructor(data: BotConstructorData) {
    this.team = data.team;
    this.rtm = data.rtm;
    this.webClient = data.webClient;
    this.installerUsersWebClients = data.installerUsersWebClients;
    this._ctx = createContextFromBot(this);
  }

  use(middleware: BotMiddleware) {
    logger.debug('use middleware', { name: middleware.name });
    this.middlewares.push(middleware);
  }

  on(name: string | any, ...middlewares: Array<BotMiddleware>) {
    const allMiddlewares = [...this.middlewares, ...middlewares];
    logger.debug('register middlewares on event', {
      name,
      middlewareLength: allMiddlewares.length,
    });
    const callback = compose(allMiddlewares);

    if (typeof name === 'symbol') {
      this.internalEventEmitter.on(name.toString(), callback);
      return;
    }

    this.rtm.on(name, (event: Object) => {
      logger.debug('event', { name, event });
      callback(createContextFromEvent(this._ctx, event));
    });
  }

  messageReceived({ type, name, data }: { type: string; name: string; data: any }) {
    if (type === 'event') {
      if (name === INTERACTIVE_MESSAGE_RESPONSE.toString()) {
        const ctx = createContextFromHttp(this._ctx, data);
        this.internalEventEmitter.emit(name, ctx);
      }
    }
  }

  start() {
    this.rtm.on('authenticated', ({ self }) => {
      this.id = self.id;
      this.name = self.name;
      logger.debugSuccess('authenticated', { id: self.id, name: self.name });
    });
    this.rtm.on('ready', () => {
      logger.infoSuccess('ready', { id: this.id, name: this.name });
      if (process.send) process.send('ready');
    });
    this.rtm.on('disconnected', () => {
      logger.debug('disconnected', { id: this.id, name: this.name });
    });
    this.rtm.start({});
    return this;
  }

  close() {
    this.rtm.removeAllListeners();
    this.rtm.disconnect();
    delete this.rtm;
    delete this.webClient;
    delete this.installerUsersWebClients;
  }
}
