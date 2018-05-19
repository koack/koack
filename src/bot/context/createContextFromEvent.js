import type { EventContextType, ContextType } from '../types';

const extractIdFromEvent = (key: string) => (
  (event: Object) => {
    if (typeof event[key] === 'string') {
      return event[key];
    }
    if (typeof event[key] === 'object') {
      return event[key].id;
    }

    return null;
  }
);

const extrackUserIdFromEvent = extractIdFromEvent('user');
const extrackChannelIdFromEvent = extractIdFromEvent('channel');

export default (botContext: ContextType, event: Object): EventContextType => {
  const ctx = Object.create(botContext);

  return Object.assign(ctx, {
    event,
    userId: extrackUserIdFromEvent(event),
    channelId: extrackChannelIdFromEvent(event),
    logger: ctx.logger.context({ text: event.text }),
  });
};
