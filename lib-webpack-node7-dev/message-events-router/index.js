import Logger from 'nightingale-logger';
import { EventHandlerType as _EventHandlerType, MessageEventType as _MessageEventType } from './types';
import createEventHandlersMap from './createEventHandlersMap';

import t from 'flow-runtime';
const EventHandlerType = t.tdz(() => _EventHandlerType);
const MessageEventType = t.tdz(() => _MessageEventType);
const logger = new Logger('koack:message-events-router');

const handle = (ctx, messageEvent, eventHandler) => {
  let _messageEventType = t.ref(MessageEventType);

  let _eventHandlerType = t.ref(EventHandlerType);

  t.param('messageEvent', _messageEventType).assert(messageEvent);
  t.param('eventHandler', _eventHandlerType).assert(eventHandler);

  let messageCtx = Object.create(ctx);

  Object.assign(messageCtx, {
    messageEvent,
    logger: ctx.logger.context(Object.assign({}, ctx.logger._context, {
      messageEvent
    }))
  });

  eventHandler.handler(messageCtx);
};

export default (function messageEventsRouter(actions) {
  let _actionsType = t.array(t.ref(EventHandlerType));

  t.param('actions', _actionsType).assert(actions);

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

    const messageEvent = t.ref(MessageEventType).assert({ ts, teamId, userId, channelId });

    handle(ctx, messageEvent, eventHandler);
  };
});
//# sourceMappingURL=index.js.map