import compose from 'koa-compose';
import Logger from 'nightingale-logger';


const logger = new Logger('koack:message-router:actions');

export default (actions => {
  const map = {
    dm: { commands: new Map(), regexps: [] },
    channel: { commands: new Map(), regexps: [] },
    group: { commands: new Map(), regexps: [] }
  };

  actions.forEach(action => {
    if (!action.where) action.where = ['dm', 'channel', 'group'];
    if (!action.mention) action.mention = action.where.filter(v => v !== 'dm');
    if (!action.handler) action.handler = compose(action.middlewares);
    if (action.stop !== false) action.stop = true;

    action.where.forEach(where => {
      const commands = map[where].commands;
      const regexps = map[where].regexps;

      if (action.commands) {
        action.commands.forEach(command => {
          if (commands.has(command) && commands.get(command) !== action) {
            logger.warn('override action', { command });
          }

          commands.get(where).set(command, action);
        });
      }

      if (action.regexp || !action.commands) {
        regexps.push(action);
      }
    });
  });

  return map;
});
//# sourceMappingURL=createActionHandlersMap.js.map