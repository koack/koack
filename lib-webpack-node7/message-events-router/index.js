import Logger from 'nightingale-logger';

import createEventHandlersMap from './createEventHandlersMap';

const logger = new Logger('koack:message-events-router');

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

export default (actions => {
  const map = createEventHandlersMap(actions);

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
});
//# sourceMappingURL=index.js.map