'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createContextFromBot = require('./createContextFromBot');

var _createContextFromBot2 = _interopRequireDefault(_createContextFromBot);

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
  const ctx = (0, _createContextFromBot2.default)(bot);

  Object.assign(ctx, {
    event,
    userId: extrackUserIdFromEvent(event),
    channelId: extrackChannelIdFromEvent(event)
  });

  ctx.logger.extendsContext({
    text: event.text
  });

  return ctx;
};
//# sourceMappingURL=createContextFromEvent.js.map