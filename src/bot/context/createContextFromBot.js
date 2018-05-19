import Logger from 'nightingale-logger/src';
import Bot from '../Bot';
import contextPrototype from './contextPrototype';
import type { ContextType } from '../types';

export default (bot: Bot): ContextType => {
  const ctx = Object.create(contextPrototype);

  Object.assign(ctx, {
    bot,
    rtm: bot.rtm,
    webClient: bot.webClient,
    team: bot.team,
  });

  ctx.logger = new Logger('bot');
  ctx.logger.setContext({
    team: bot.team && { id: bot.team.id, name: bot.team.name },
    user: ctx.user && ctx.user.name,
  });

  return ctx;
};
