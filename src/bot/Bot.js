import { RtmClient, WebClient } from '@slack/client';
import compose from 'koa-compose';
import contextPrototype from './contextPrototype';

type BotConstructorArguments = {|
  rtm: RtmClient,
  webClient: WebClient,
  installerUsersWebClients: null | Map<string, WebClient>,
|};

export default class Bot {
  rtm: RtmClient;
  webClient: WebClient;
  installerUsersWebClients: null | Map<string, WebClient>;

  constructor(data: BotConstructorArguments) {
    Object.assign(this, data);
    this.context = Object.create(contextPrototype);
  }

  use(middleware) {
    throw new Error('Not yet supported');
  }

  on(name: string, ...middlewares: Array<Function>) {
    const callback = compose(middlewares);
    this.rtm.on(name, event => callback(this.createContext(event)));
  }

  createContext(event) {
    const ctx = Object.create(contextPrototype);
    Object.assign(ctx, {
      bot: this,
      rtm: this.rtm,
    });
    ctx.logger = logger.context({ team });
  }

  close() {
    this.rtm.removeAllListeners();
    this.rtm.disconnect();
    delete this.rtm;
    delete this.webClient;
    delete this.installerUsersWebClients;
  }
}
