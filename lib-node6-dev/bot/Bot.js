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

var _contextPrototype = require('./contextPrototype');

var _contextPrototype2 = _interopRequireDefault(_contextPrototype);

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
    this.context = Object.create(_contextPrototype2.default);
  }

  use(middleware) {
    _assert(middleware, _types.MiddlewareType, 'middleware');

    logger.debug('use middleware', { name: middleware.name });
    this.middlewares.push(middleware);
  }

  on(name, ...middlewares) {
    _assert(name, _tcombForked2.default.String, 'name');

    _assert(middlewares, _tcombForked2.default.list(_types.MiddlewareType), 'middlewares');

    logger.debug('register middlewares on event', { name });
    const callback = (0, _koaCompose2.default)([...this.middlewares, ...middlewares]);
    this.rtm.on(name, event => callback(this.createContext(event)));
  }

  createContext(event) {
    return _assert(function () {
      const ctx = Object.create(_contextPrototype2.default);

      Object.assign(ctx, {
        bot: this,
        rtm: this.rtm,
        webClient: this.webClient,
        event,
        teamId: event.team,
        userId: event.user,
        channelId: event.channel
      });

      ctx.logger = new _nightingaleLogger2.default('bot');
      ctx.logger.setContext({
        team: this.team,
        user: ctx.user && ctx.user.name,
        text: event.text
      });

      return ctx;
    }.apply(this, arguments), _types.ContextType, 'return value');
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
  function message() {
    return 'Invalid value ' + _tcombForked2.default.stringify(x) + ' supplied to ' + name + ' (expected a ' + _tcombForked2.default.getTypeName(type) + ')';
  }

  if (_tcombForked2.default.isType(type)) {
    if (!type.is(x)) {
      type(x, [name + ': ' + _tcombForked2.default.getTypeName(type)]);

      _tcombForked2.default.fail(message());
    }
  } else if (!(x instanceof type)) {
    _tcombForked2.default.fail(message());
  }

  return x;
}
//# sourceMappingURL=Bot.js.map