/* @flow */
import { RtmClient, WebClient, CLIENT_EVENTS } from '@slack/client';
import Logger from 'nightingale-logger/src';
import compose from 'koa-compose';
import createContextFromEvent from './context/createContextFromEvent';
import type { MiddlewareType } from './types';
import type { TeamType } from '../types';

type BotConstructorArguments = {|
  team: ?TeamType,
  rtm: RtmClient,
  webClient: WebClient,
  installerUsersWebClients: null | Map<string, WebClient>,
|};

const logger = new Logger('koack:bot');

export default class Bot {
  team: ?TeamType;
  rtm: RtmClient;
  webClient: WebClient;
  installerUsersWebClients: null | Map<string, WebClient>;
  middlewares: Array<MiddlewareType> = [];

  constructor(data: BotConstructorArguments) {
    Object.assign(this, data);
  }

  use(middleware: MiddlewareType) {
    logger.debug('use middleware', { name: middleware.name });
    this.middlewares.push(middleware);
  }

  on(name: string, ...middlewares: Array<MiddlewareType>) {
    const allMiddlewares = [...this.middlewares, ...middlewares];
    logger.debug('register middlewares on event', { name, middlewareLength: allMiddlewares.length });
    const callback = compose(allMiddlewares);
    this.rtm.on(name, (event: Object) => {
      logger.debug('event', { name, event });
      callback(createContextFromEvent(this, event));
    });
  }

  start() {
    this.rtm.on(CLIENT_EVENTS.RTM.RTM_CONNECTION_OPENED, () => {
      logger.infoSuccess('connection opened');
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
}
