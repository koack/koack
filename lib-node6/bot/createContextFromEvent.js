'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _nightingaleLogger = require('nightingale-logger');

var _nightingaleLogger2 = _interopRequireDefault(_nightingaleLogger);

var _contextPrototype = require('./contextPrototype');

var _contextPrototype2 = _interopRequireDefault(_contextPrototype);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const extractIdFromEvent = key => event => {
  if (typeof event[key] === 'string') {
    return event[key];
  }
  if (typeof event[key] === 'object') {
    return event[key].id;
  }

  return null;
};

const extrackUserIdFromEvent = extractIdFromEvent('user');
const extrackChannelIdFromEvent = extractIdFromEvent('channel');

exports.default = (bot, event) => {
  const ctx = Object.create(_contextPrototype2.default);

  Object.assign(ctx, {
    bot,
    rtm: bot.rtm,
    webClient: bot.webClient,
    team: bot.team,
    event,
    userId: extrackUserIdFromEvent(event),
    channelId: extrackChannelIdFromEvent(event)
  });

  ctx.logger = new _nightingaleLogger2.default('bot');
  ctx.logger.setContext({
    team: bot.team,
    user: ctx.user && ctx.user.name,
    text: event.text
  });

  return ctx;
};
//# sourceMappingURL=createContextFromEvent.js.map