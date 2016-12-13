'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var _nightingaleLogger = require('nightingale-logger');

var _nightingaleLogger2 = _interopRequireDefault(_nightingaleLogger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const logger = new _nightingaleLogger2.default('koack:message-events');

exports.default = function messageEvents() {
  new _events2.default();


  return (ctx, next) => {
    const { teamId, userId, channelId } = ctx;
    const { ts, text: originalText, type: messageType, subtype: messageSubtype } = ctx.event;
    const destinationType = ctx.getChannelType();

    if (!destinationType) {
      logger.warn('Unsupported destination type', { destinationType });
      return next();
    }
  };
};
//# sourceMappingURL=index.js.map