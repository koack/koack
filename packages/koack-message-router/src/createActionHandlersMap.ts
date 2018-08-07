import compose from 'koa-compose';
import Logger from 'nightingale-logger';
import { Action } from './types';

const logger = new Logger('koack:message-router:actions');

export interface ActionHandlers {
  commands: Map<string, Action>;
  regexps: Array<Action>;
}

export interface ActionsMap {
  dm: ActionHandlers;
  channel: ActionHandlers;
  group: ActionHandlers;
}

export default (actions: Array<Action>): ActionsMap => {
  const map: ActionsMap = {
    dm: { commands: new Map(), regexps: [] },
    channel: { commands: new Map(), regexps: [] },
    group: { commands: new Map(), regexps: [] },
  };

  actions.forEach((action: Action) => {
    if (!action.where) action.where = ['dm', 'channel', 'group'];
    if (!action.mention) action.mention = action.where.filter(v => v !== 'dm');
    if (!action.handler) action.handler = compose(action.middlewares);
    if (action.stop !== false) action.stop = true;

    action.where.forEach(where => {
      const commands: Map<string, Action> = map[where].commands;
      const regexps: Array<Action> = map[where].regexps;

      if (action.commands) {
        action.commands.forEach((command: string) => {
          if (commands.has(command) && commands.get(command) !== action) {
            logger.warn('override action', { command });
          }

          commands.set(command, action);
        });
      }

      if (action.regexp || !action.commands) {
        regexps.push(action);
      }
    });
  });

  return map;
};
