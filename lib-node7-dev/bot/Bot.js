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

var _types = require('./types');

var _types2 = require('../types');

var _flowRuntime = require('flow-runtime');

var _flowRuntime2 = _interopRequireDefault(_flowRuntime);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const TeamType = _flowRuntime2.default.tdz(() => _types2.TeamType);

const MiddlewareType = _flowRuntime2.default.tdz(() => _types.MiddlewareType);

const BotConstructorArguments = _flowRuntime2.default.type('BotConstructorArguments', _flowRuntime2.default.exactObject(_flowRuntime2.default.property('team', _flowRuntime2.default.nullable(_flowRuntime2.default.ref(TeamType))), _flowRuntime2.default.property('rtm', _flowRuntime2.default.ref(_client.RtmClient)), _flowRuntime2.default.property('webClient', _flowRuntime2.default.ref(_client.WebClient)), _flowRuntime2.default.property('installerUsersWebClients', _flowRuntime2.default.union(_flowRuntime2.default.null(), _flowRuntime2.default.ref('Map', _flowRuntime2.default.string(), _flowRuntime2.default.ref(_client.WebClient))))));

const logger = new _nightingaleLogger2.default('koack:bot');

class Bot {
  /** bot id in the team */
  constructor(data) {
    _flowRuntime2.default.param('data', BotConstructorArguments).assert(data);

    Object.assign(this, data);
  }
  /** bot name in the team */


  use(middleware) {
    let _middlewareType = _flowRuntime2.default.ref(MiddlewareType);

    _flowRuntime2.default.param('middleware', _middlewareType).assert(middleware);

    logger.debug('use middleware', { name: middleware.name });
    this.middlewares.push(middleware);
  }

  on(name, ...middlewares) {
    let _nameType = _flowRuntime2.default.string();

    let _middlewaresType = _flowRuntime2.default.array(_flowRuntime2.default.ref(MiddlewareType));

    _flowRuntime2.default.param('name', _nameType).assert(name);

    _flowRuntime2.default.rest('middlewares', _middlewaresType).assert(middlewares);

    const allMiddlewares = [...this.middlewares, ...middlewares];
    logger.debug('register middlewares on event', { name, middlewareLength: allMiddlewares.length });
    const callback = (0, _koaCompose2.default)(allMiddlewares);
    this.rtm.on(name, event => {
      let _eventType = _flowRuntime2.default.object();

      _flowRuntime2.default.param('event', _eventType).assert(event);

      logger.debug('event', { name, event });
      callback((0, _createContextFromEvent2.default)(this, event));
    });
  }

  start() {
    this.rtm.on(_client.CLIENT_EVENTS.RTM.AUTHENTICATED, ({ self }) => {
      this.id = self.id;
      this.name = self.name;
      logger.debugSuccess('authenticated', { id: self.id, name: self.name });
    });
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