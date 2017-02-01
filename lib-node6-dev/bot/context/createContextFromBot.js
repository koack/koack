'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _arguments = arguments;

var _tcombForked = require('tcomb-forked');

var _tcombForked2 = _interopRequireDefault(_tcombForked);

var _nightingaleLogger = require('nightingale-logger');

var _nightingaleLogger2 = _interopRequireDefault(_nightingaleLogger);

var _Bot = require('../Bot');

var _Bot2 = _interopRequireDefault(_Bot);

var _contextPrototype = require('./contextPrototype');

var _contextPrototype2 = _interopRequireDefault(_contextPrototype);

var _types = require('../types');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function createContextFromBot(bot) {
  _assert(bot, _Bot2.default, 'bot');

  return _assert(function () {
    const ctx = Object.create(_contextPrototype2.default);

    Object.assign(ctx, {
      bot,
      rtm: bot.rtm,
      webClient: bot.webClient,
      team: bot.team
    });

    ctx.logger = new _nightingaleLogger2.default('bot');
    ctx.logger.setContext({
      team: bot.team,
      user: ctx.user && ctx.user.name
    });

    return ctx;
  }.apply(undefined, _arguments), _types.ContextType, 'return value');
};

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
//# sourceMappingURL=createContextFromBot.js.map