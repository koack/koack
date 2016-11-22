import { RtmClient, WebClient } from '@slack/client';
import compose from 'koa-compose';

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
  }

  on(name: string, ...middlewares: Array<Function>) {
    const compose = compose(middlewares);
    this.rtm.on(name, event => );
  }

  close() {
    this.rtm.removeAllListeners();
    this.rtm.disconnect();
    delete this.rtm;
    delete this.webClient;
    delete this.installerUsersWebClients;
  }
}
