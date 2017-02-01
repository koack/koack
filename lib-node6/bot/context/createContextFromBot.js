'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _nightingaleLogger = require('nightingale-logger');

var _nightingaleLogger2 = _interopRequireDefault(_nightingaleLogger);

var _contextPrototype = require('./contextPrototype');

var _contextPrototype2 = _interopRequireDefault(_contextPrototype);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = bot => {
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
};
//# sourceMappingURL=createContextFromBot.js.map