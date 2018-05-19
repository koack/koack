import Logger from 'nightingale-logger';

import contextPrototype from './contextPrototype';


export default (bot => {
  const ctx = Object.create(contextPrototype);

  Object.assign(ctx, {
    bot,
    rtm: bot.rtm,
    webClient: bot.webClient,
    team: bot.team
  });

  ctx.logger = new Logger('bot');
  ctx.logger.setContext({
    team: bot.team && { id: bot.team.id, name: bot.team.name },
    user: ctx.user && ctx.user.name
  });

  return ctx;
});
//# sourceMappingURL=createContextFromBot.js.map