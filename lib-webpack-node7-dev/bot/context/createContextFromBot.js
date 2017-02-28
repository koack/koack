import Logger from 'nightingale-logger';
import Bot from '../Bot';
import contextPrototype from './contextPrototype';
import { ContextType as _ContextType } from '../types';

import t from 'flow-runtime';
const ContextType = t.tdz(() => _ContextType);
export default (function createContextFromBot(bot) {
  let _botType = t.ref(Bot);

  const _returnType = t.return(t.ref(ContextType));

  t.param('bot', _botType).assert(bot);

  const ctx = Object.create(contextPrototype);

  Object.assign(ctx, {
    bot,
    rtm: bot.rtm,
    webClient: bot.webClient,
    team: bot.team
  });

  ctx.logger = new Logger('bot');
  ctx.logger.setContext({
    team: bot.team,
    user: ctx.user && ctx.user.name
  });

  return _returnType.assert(ctx);
});
//# sourceMappingURL=createContextFromBot.js.map