'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _nightingaleLogger = require('nightingale-logger');

var _nightingaleLogger2 = _interopRequireDefault(_nightingaleLogger);

var _types = require('./types');

var _createEventHandlersMap = require('./createEventHandlersMap');

var _createEventHandlersMap2 = _interopRequireDefault(_createEventHandlersMap);

var _flowRuntime = require('flow-runtime');

var _flowRuntime2 = _interopRequireDefault(_flowRuntime);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const EventHandlerType = _flowRuntime2.default.tdz(() => _types.EventHandlerType);

const MessageEventType = _flowRuntime2.default.tdz(() => _types.MessageEventType);

const logger = new _nightingaleLogger2.default('koack:message-events-router');

const handle = (ctx, messageEvent, eventHandler) => {
  let _messageEventType = _flowRuntime2.default.ref(MessageEventType);

  let _eventHandlerType = _flowRuntime2.default.ref(EventHandlerType);

  _flowRuntime2.default.param('messageEvent', _messageEventType).assert(messageEvent);

  _flowRuntime2.default.param('eventHandler', _eventHandlerType).assert(eventHandler);

  let messageCtx = Object.create(ctx);

  Object.assign(messageCtx, {
    messageEvent,
    logger: ctx.logger.context(Object.assign({}, ctx.logger._context, {
      messageEvent
    }))
  });

  eventHandler.handler(messageCtx);
};

exports.default = function messageEventsRouter(actions) {
  let _actionsType = _flowRuntime2.default.array(_flowRuntime2.default.ref(EventHandlerType));

  _flowRuntime2.default.param('actions', _actionsType).assert(actions);

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

    const messageEvent = _flowRuntime2.default.ref(MessageEventType).assert({ ts, teamId, userId, channelId });

    handle(ctx, messageEvent, eventHandler);
  };
};
//# sourceMappingURL=index.js.map