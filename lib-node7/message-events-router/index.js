'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _nightingaleLogger = require('nightingale-logger');

var _nightingaleLogger2 = _interopRequireDefault(_nightingaleLogger);

var _createEventHandlersMap = require('./createEventHandlersMap');

var _createEventHandlersMap2 = _interopRequireDefault(_createEventHandlersMap);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const logger = new _nightingaleLogger2.default('koack:message-events-router');

const handle = (ctx, messageEvent, eventHandler) => {
  let messageCtx = Object.create(ctx);

  Object.assign(messageCtx, {
    messageEvent,
    logger: ctx.logger.context(Object.assign({}, ctx.logger._context, {
      messageEvent
    }))
  });

  eventHandler.handler(messageCtx);
};

exports.default = actions => {
  const map = (0, _createEventHandlersMap2.default)(actions);

  return (ctx, next) => {
    const { ts, subtype: messageType } = ctx.event;
    if (!messageType) return next();

    const { teamId, userId, channelId } = ctx;
    const destinationType = ctx.getChannelType();

    logger.debug('message event', { ts, destinationType, messageType });
    if (!destinationType) {
      logger.warn('Unsupported destination type', { destinationType });
      return next();
    }

    const eventHandler = map[destinationType].get(messageType);
    if (!eventHandler) return next();

    handle(ctx, { ts, teamId, userId, channelId }, eventHandler);
  };
};
//# sourceMappingURL=index.js.map