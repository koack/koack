import Bot from '../Bot';
import createContextFromBot from './createContextFromBot';
import type { EventContextType } from '../types';

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

export default (bot: Bot, event: Object): EventContextType => {
  const ctx = createContextFromBot(bot);

  Object.assign(ctx, {
    event,
    userId: extrackUserIdFromEvent(event),
    channelId: extrackChannelIdFromEvent(event),
  });

  ctx.logger.extendsContext({
    text: event.text,
  });

  return ctx;
};
