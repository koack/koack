import { RtmClient, WebClient, CLIENT_EVENTS } from '@slack/client';
import Logger from 'nightingale-logger';
import compose from 'koa-compose';
import createContextFromEvent from './context/createContextFromEvent';


const logger = new Logger('koack:bot');

export default class Bot {
  /** bot id in the team */
  constructor(data) {
    this.middlewares = [];

    Object.assign(this, data);
  }
  /** bot name in the team */


  use(middleware) {
    logger.debug('use middleware', { name: middleware.name });
    this.middlewares.push(middleware);
  }

  on(name, ...middlewares) {
    const allMiddlewares = [...this.middlewares, ...middlewares];
    logger.debug('register middlewares on event', { name, middlewareLength: allMiddlewares.length });
    const callback = compose(allMiddlewares);
    this.rtm.on(name, event => {
      logger.debug('event', { name, event });
      callback(createContextFromEvent(this, event));
    });
  }

  start() {
    this.rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, ({ self }) => {
      this.id = self.id;
      this.name = self.name;
      logger.debugSuccess('authenticated', { id: self.id, name: self.name });
    });
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
//# sourceMappingURL=Bot.js.map