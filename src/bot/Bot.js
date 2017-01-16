/* @flow */
import { RtmClient, WebClient } from '@slack/client';
import Logger from 'nightingale-logger/src';
import compose from 'koa-compose';
import contextPrototype from './contextPrototype';
import type { MiddlewareType, ContextType } from './types';
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
    this.context = Object.create(contextPrototype);
  }

  use(middleware: MiddlewareType) {
    logger.debug('use middleware', { name: middleware.name });
    this.middlewares.push(middleware);
  }

  on(name: string, ...middlewares: Array<MiddlewareType>) {
    const allMiddlewares = [...this.middlewares, ...middlewares];
    logger.debug('register middlewares on event', { name, middlewareLength: allMiddlewares.length });
    const callback = compose(allMiddlewares);
    this.rtm.on(name, event => callback(this.createContext(event)));
  }

  createContext(event): ContextType {
    const ctx = Object.create(contextPrototype);

    Object.assign(ctx, {
      bot: this,
      rtm: this.rtm,
      webClient: this.webClient,
      event,
      teamId: event.team,
      userId: event.user,
      channelId: event.channel,
    });

    ctx.logger = new Logger('bot');
    ctx.logger.setContext({
      team: this.team,
      user: ctx.user && ctx.user.name,
      text: event.text,
    });

    return ctx;
  }

  close() {
    this.rtm.removeAllListeners();
    this.rtm.disconnect();
    delete this.rtm;
    delete this.webClient;
    delete this.installerUsersWebClients;
  }
}
