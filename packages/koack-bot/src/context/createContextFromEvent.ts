import { EventContext, Context } from '../types';

const extractIdFromEvent = (key: string) => (event: any): string | null => {
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

export default (botContext: Context, event: any): EventContext => {
  const ctx = Object.create(botContext);

  return Object.assign(ctx, {
    event,
    userId: extrackUserIdFromEvent(event),
    channelId: extrackChannelIdFromEvent(event),
    logger: ctx.logger.context({ text: event.text }),
  });
};
