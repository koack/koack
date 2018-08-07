import Logger from 'nightingale-logger';
import { BotContext } from 'koack-bot/src/types';
import { CallbackEventHandler, EventHandler, MessageEvent, MessageContext } from './types';
import createEventHandlersMap from './createEventHandlersMap';

const logger = new Logger('koack:message-events-router');

const handle = (
  ctx: BotContext,
  messageEvent: MessageEvent,
  eventHandler: CallbackEventHandler,
) => {
  const messageCtx: MessageContext = Object.create(ctx);

  Object.assign(messageCtx, {
    messageEvent,
    logger: ctx.logger.context({
      ...ctx.logger.getContextObject(),
      messageEvent,
    }),
  });

  eventHandler.handler(messageCtx);
};

export default (actions: Array<EventHandler>) => {
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

    const messageEvent: MessageEvent = { ts, teamId, userId, channelId };

    handle(ctx, messageEvent, eventHandler);
  };
};
