import { RtmClient, WebClient, CLIENT_EVENTS } from '@slack/client';
import Logger from 'nightingale-logger';
import compose from 'koa-compose';
import { EventEmitter } from 'events';
import createContextFromBot from './context/createContextFromBot';
import createContextFromEvent from './context/createContextFromEvent';
import createContextFromHttp from './context/createContextFromInteractiveMessageResponse';

import { INTERACTIVE_MESSAGE_RESPONSE } from '../index';

const logger = new Logger('koack:bot');

let Bot = class {
  /** bot name in the team */
  constructor(data) {
    this.middlewares = [];
    this.internalEventEmitter = new EventEmitter();

    Object.assign(this, data);
    this._ctx = createContextFromBot(this);
  }
  /** bot id in the team */


  use(middleware) {
    logger.debug('use middleware', { name: middleware.name });
    this.middlewares.push(middleware);
  }

  on(name, ...middlewares) {
    const allMiddlewares = [...this.middlewares, ...middlewares];
    logger.debug('register middlewares on event', { name, middlewareLength: allMiddlewares.length });
    const callback = compose(allMiddlewares);

    if (typeof name === 'symbol') {
      this.internalEventEmitter.on(name.toString(), callback);
      return;
    }

    this.rtm.on(name, event => {
      logger.debug('event', { name, event });
      callback(createContextFromEvent(this._ctx, event));
    });
  }

  messageReceived({ type, name, data }) {
    if (type === 'event') {
      if (name === INTERACTIVE_MESSAGE_RESPONSE.toString()) {
        const ctx = createContextFromHttp(this._ctx, data);
        this.internalEventEmitter.emit(name, ctx);
      }
    }
  }

  start() {
    this.rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, ({ self }) => {
      this.id = self.id;
      this.name = self.name;
      logger.debugSuccess('authenticated', { id: self.id, name: self.name });
    });
    this.rtm.on(CLIENT_EVENTS.RTM.RTM_CONNECTION_OPENED, () => {
      logger.infoSuccess('connection opened', { id: this.id, name: this.name });
      if (process.send) process.send('ready');
    });
    this.rtm.start();
    return this;
  }

  close() {
    this.rtm.removeAllListeners();
    this.rtm.disconnect();
    delete this.rtm;
    delete this.webClient;
    delete this.installerUsersWebClients;
  }
};
export { Bot as default };
//# sourceMappingURL=Bot.js.map