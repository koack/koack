'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var compose = _interopDefault(require('koa-compose'));
var Logger = _interopDefault(require('nightingale-logger'));

var createEventHandlersMap = (actions => {
  const map = {
    dm: new Map(),
    channel: new Map(),
    group: new Map()
  };
  actions.forEach(eventHandler => {
    if (!eventHandler.where) eventHandler.where = ['dm', 'channel', 'group'];

    if (eventHandler.handler === undefined) {
      eventHandler.handler = compose(eventHandler.middlewares);
    }

    eventHandler.where.forEach(where => {
      eventHandler.events.forEach(eventName => {
        if (map[where].has(eventName)) throw new Error(`event redefined: "${eventName}"`);
        map[where].set(eventName, eventHandler);
      });
    });
  });
  return map;
});

const logger = new Logger('koack:message-events-router');

const handle = (ctx, messageEvent, eventHandler) => {
  const messageCtx = Object.create(ctx);
  Object.assign(messageCtx, {
    messageEvent,
    logger: ctx.logger.context({ ...ctx.logger.getContextObject(),
      messageEvent
    })
  });
  eventHandler.handler(messageCtx);
};

var index = (actions => {
  const map = createEventHandlersMap(actions);
  return (ctx, next) => {
    const {
      ts,
      subtype: messageType
    } = ctx.event;
    if (!messageType) return next();
    const {
      teamId,
      userId,
      channelId
    } = ctx;
    const destinationType = ctx.getChannelType();
    logger.debug('message event', {
      ts,
      destinationType,
      messageType
    });

    if (!destinationType) {
      logger.warn('Unsupported destination type', {
        destinationType
      });
      return next();
    }

    const eventHandler = map[destinationType].get(messageType);
    if (!eventHandler) return next();
    handle(ctx, {
      ts,
      teamId,
      userId,
      channelId
    }, eventHandler);
  };
});

exports.default = index;
//# sourceMappingURL=index-node10.cjs.js.map
