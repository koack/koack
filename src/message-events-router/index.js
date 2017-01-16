/* @flow */
import Logger from 'nightingale-logger/src';
import type { EventHandlerType, MessageEventType } from './types';
import createEventHandlersMap from './createEventHandlersMap';

const logger = new Logger('koack:message-events-router');

const handle = (ctx, messageEvent: MessageEventType, eventHandler: EventHandlerType) => {
  let messageCtx = Object.create(ctx);

  Object.assign(messageCtx, {
    messageEvent,
    logger: ctx.logger.context({
      ...ctx.logger._context,
      messageEvent,
    }),
  });

  eventHandler.handler(messageCtx);
};

export default (actions: Array<EventHandlerType>) => {
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

    const messageEvent: MessageEventType = { ts, teamId, userId, channelId };

    handle(ctx, messageEvent, eventHandler);
  };
};
