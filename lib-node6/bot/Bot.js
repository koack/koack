'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _client = require('@slack/client');

var _nightingaleLogger = require('nightingale-logger');

var _nightingaleLogger2 = _interopRequireDefault(_nightingaleLogger);

var _koaCompose = require('koa-compose');

var _koaCompose2 = _interopRequireDefault(_koaCompose);

var _createContextFromEvent = require('./context/createContextFromEvent');

var _createContextFromEvent2 = _interopRequireDefault(_createContextFromEvent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const logger = new _nightingaleLogger2.default('koack:bot');

class Bot {

  constructor(data) {
    this.middlewares = [];

    Object.assign(this, data);
  }

  use(middleware) {
    logger.debug('use middleware', { name: middleware.name });
    this.middlewares.push(middleware);
  }

  on(name, ...middlewares) {
    const allMiddlewares = [...this.middlewares, ...middlewares];
    logger.debug('register middlewares on event', { name, middlewareLength: allMiddlewares.length });
    const callback = (0, _koaCompose2.default)(allMiddlewares);
    this.rtm.on(name, event => {
      logger.debug('event', { name, event });
      callback((0, _createContextFromEvent2.default)(this, event));
    });
  }

  start() {
    this.rtm.on(_client.CLIENT_EVENTS.RTM.RTM_CONNECTION_OPENED, () => {
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
exports.default = Bot;
//# sourceMappingURL=Bot.js.map