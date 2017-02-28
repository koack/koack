import compose from 'koa-compose';
import Logger from 'nightingale-logger';
import { ActionType as _ActionType } from './types';

import t from 'flow-runtime';
const ActionType = t.tdz(() => _ActionType);
const logger = new Logger('koack:message-router:actions');

const ActionHandlersType = t.type('ActionHandlersType', t.object(t.property('commands', t.ref('Map', t.string(), t.ref(ActionType))), t.property('regexps', t.array(t.ref(ActionType)))));
const ActionsMapType = t.type('ActionsMapType', t.object(t.property('dm', ActionHandlersType), t.property('channel', ActionHandlersType), t.property('group', ActionHandlersType)));


export default (function createActionHandlersMap(actions) {
  let _actionsType = t.array(t.ref(ActionType));

  const _returnType = t.return(ActionsMapType);

  t.param('actions', _actionsType).assert(actions);

  const map = ActionsMapType.assert({
    dm: { commands: new Map(), regexps: [] },
    channel: { commands: new Map(), regexps: [] },
    group: { commands: new Map(), regexps: [] }
  });

  actions.forEach(action => {
    let _actionType = t.ref(ActionType);

    t.param('action', _actionType).assert(action);

    if (!action.where) action.where = ['dm', 'channel', 'group'];
    if (!action.mention) action.mention = action.where.filter(v => v !== 'dm');
    if (!action.handler) action.handler = compose(action.middlewares);
    if (action.stop !== false) action.stop = true;

    action.where.forEach(where => {
      const commands = map[where].commands;
      const regexps = map[where].regexps;

      if (action.commands) {
        action.commands.forEach(command => {
          let _commandType = t.string();

          t.param('command', _commandType).assert(command);

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

  return _returnType.assert(map);
});
//# sourceMappingURL=createActionHandlersMap.js.map