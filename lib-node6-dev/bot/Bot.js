'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _tcombForked = require('tcomb-forked');

var _tcombForked2 = _interopRequireDefault(_tcombForked);

var _client = require('@slack/client');

var _nightingaleLogger = require('nightingale-logger');

var _nightingaleLogger2 = _interopRequireDefault(_nightingaleLogger);

var _koaCompose = require('koa-compose');

var _koaCompose2 = _interopRequireDefault(_koaCompose);

var _createContextFromEvent = require('./context/createContextFromEvent');

var _createContextFromEvent2 = _interopRequireDefault(_createContextFromEvent);

var _types = require('./types');

var _types2 = require('../types');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const BotConstructorArguments = _tcombForked2.default.interface({
  team: _tcombForked2.default.maybe(_types2.TeamType),
  rtm: _client.RtmClient,
  webClient: _client.WebClient,
  installerUsersWebClients: _tcombForked2.default.union([_tcombForked2.default.Nil, Map])
}, {
  name: 'BotConstructorArguments',
  strict: true
});

const logger = new _nightingaleLogger2.default('koack:bot');

class Bot {

  constructor(data) {
    _assert(data, BotConstructorArguments, 'data');

    this.middlewares = [];

    Object.assign(this, data);
  }

  use(middleware) {
    _assert(middleware, _types.MiddlewareType, 'middleware');

    logger.debug('use middleware', { name: middleware.name });
    this.middlewares.push(middleware);
  }

  on(name, ...middlewares) {
    _assert(name, _tcombForked2.default.String, 'name');

    _assert(middlewares, _tcombForked2.default.list(_types.MiddlewareType), 'middlewares');

    const allMiddlewares = [...this.middlewares, ...middlewares];
    logger.debug('register middlewares on event', { name, middlewareLength: allMiddlewares.length });
    const callback = (0, _koaCompose2.default)(allMiddlewares);
    this.rtm.on(name, event => {
      _assert(event, _tcombForked2.default.Object, 'event');

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

function _assert(x, type, name) {
  if (false) {
    _tcombForked2.default.fail = function (message) {
      console.warn(message);
    };
  }

  if (_tcombForked2.default.isType(type) && type.meta.kind !== 'struct') {
    if (!type.is(x)) {
      type(x, [name + ': ' + _tcombForked2.default.getTypeName(type)]);
    }
  } else if (!(x instanceof type)) {
    _tcombForked2.default.fail('Invalid value ' + _tcombForked2.default.stringify(x) + ' supplied to ' + name + ' (expected a ' + _tcombForked2.default.getTypeName(type) + ')');
  }

  return x;
}
//# sourceMappingURL=Bot.js.map