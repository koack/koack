'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _nightingaleLogger = require('nightingale-logger');

var _nightingaleLogger2 = _interopRequireDefault(_nightingaleLogger);

var _Bot = require('../Bot');

var _Bot2 = _interopRequireDefault(_Bot);

var _contextPrototype = require('./contextPrototype');

var _contextPrototype2 = _interopRequireDefault(_contextPrototype);

var _types = require('../types');

var _flowRuntime = require('flow-runtime');

var _flowRuntime2 = _interopRequireDefault(_flowRuntime);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const ContextType = _flowRuntime2.default.tdz(() => _types.ContextType);

exports.default = function createContextFromBot(bot) {
  let _botType = _flowRuntime2.default.ref(_Bot2.default);

  const _returnType = _flowRuntime2.default.return(_flowRuntime2.default.ref(ContextType));

  _flowRuntime2.default.param('bot', _botType).assert(bot);

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

  return _returnType.assert(ctx);
};
//# sourceMappingURL=createContextFromBot.js.map