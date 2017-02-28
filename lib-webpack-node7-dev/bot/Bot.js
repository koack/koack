import { RtmClient, WebClient, CLIENT_EVENTS } from '@slack/client';
import Logger from 'nightingale-logger';
import compose from 'koa-compose';
import createContextFromEvent from './context/createContextFromEvent';
import { MiddlewareType as _MiddlewareType } from './types';
import { TeamType as _TeamType } from '../types';

import t from 'flow-runtime';
const TeamType = t.tdz(() => _TeamType);
const MiddlewareType = t.tdz(() => _MiddlewareType);
const BotConstructorArguments = t.type('BotConstructorArguments', t.exactObject(t.property('team', t.nullable(t.ref(TeamType))), t.property('rtm', t.ref(RtmClient)), t.property('webClient', t.ref(WebClient)), t.property('installerUsersWebClients', t.union(t.null(), t.ref('Map', t.string(), t.ref(WebClient))))));


const logger = new Logger('koack:bot');

export default class Bot {
  /** bot id in the team */
  constructor(data) {
    t.param('data', BotConstructorArguments).assert(data);

    Object.assign(this, data);
  }
  /** bot name in the team */


  use(middleware) {
    let _middlewareType = t.ref(MiddlewareType);

    t.param('middleware', _middlewareType).assert(middleware);

    logger.debug('use middleware', { name: middleware.name });
    this.middlewares.push(middleware);
  }

  on(name, ...middlewares) {
    let _nameType = t.string();

    let _middlewaresType = t.array(t.ref(MiddlewareType));

    t.param('name', _nameType).assert(name);
    t.rest('middlewares', _middlewaresType).assert(middlewares);

    const allMiddlewares = [...this.middlewares, ...middlewares];
    logger.debug('register middlewares on event', { name, middlewareLength: allMiddlewares.length });
    const callback = compose(allMiddlewares);
    this.rtm.on(name, event => {
      let _eventType = t.object();

      t.param('event', _eventType).assert(event);

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