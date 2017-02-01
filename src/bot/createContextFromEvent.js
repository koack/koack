import Logger from 'nightingale-logger/src';
import Bot from './Bot';
import contextPrototype from './contextPrototype';
import type { ContextType } from './types';

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

export default (bot: Bot, event: Object): ContextType => {
  const ctx = Object.create(contextPrototype);

  Object.assign(ctx, {
    bot,
    rtm: bot.rtm,
    webClient: bot.webClient,
    team: bot.team,
    event,
    userId: extrackUserIdFromEvent(event),
    channelId: extrackChannelIdFromEvent(event),
  });

  ctx.logger = new Logger('bot');
  ctx.logger.setContext({
    team: bot.team,
    user: ctx.user && ctx.user.name,
    text: event.text,
  });

  return ctx;
};
