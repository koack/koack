/* @flow */
import compose from 'koa-compose';
import Logger from 'nightingale-logger/src';
import type { ActionType } from './types';

const logger = new Logger('koack:message-router:actions');

type ActionHandlersType = {|
  commands: Map<string, ActionType>,
  regexps: Array<ActionType>,
|};

type ActionsMapType = {|
  dm: ActionHandlersType,
  channel: ActionHandlersType,
  group: ActionHandlersType,
|};

export default (actions: Array<ActionType>): ActionsMapType => {
  const map: ActionsMapType = {
    dm: { commands: new Map(), regexps: [] },
    channel: { commands: new Map(), regexps: [] },
    group: { commands: new Map(), regexps: [] },
  };

  actions.forEach((action: ActionType) => {
    if (!action.where) action.where = ['dm', 'channel', 'group'];
    if (!action.mention) action.mention = action.where.filter(v => v !== 'dm');
    if (!action.handler) action.handler = compose(action.middlewares);
    if (action.stop !== false) action.stop = true;

    action.where.forEach((where) => {
      const commands: Map<string, ActionType> = map[where].commands;
      const regexps: Array<ActionType> = map[where].regexps;

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
