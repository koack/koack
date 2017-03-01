'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _koaCompose = require('koa-compose');

var _koaCompose2 = _interopRequireDefault(_koaCompose);

var _nightingaleLogger = require('nightingale-logger');

var _nightingaleLogger2 = _interopRequireDefault(_nightingaleLogger);

var _types = require('./types');

var _flowRuntime = require('flow-runtime');

var _flowRuntime2 = _interopRequireDefault(_flowRuntime);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const ActionType = _flowRuntime2.default.tdz(() => _types.ActionType);

const logger = new _nightingaleLogger2.default('koack:message-router:actions');

const ActionHandlersType = _flowRuntime2.default.type('ActionHandlersType', _flowRuntime2.default.exactObject(_flowRuntime2.default.property('commands', _flowRuntime2.default.ref('Map', _flowRuntime2.default.string(), _flowRuntime2.default.ref(ActionType))), _flowRuntime2.default.property('regexps', _flowRuntime2.default.array(_flowRuntime2.default.ref(ActionType)))));

const ActionsMapType = _flowRuntime2.default.type('ActionsMapType', _flowRuntime2.default.exactObject(_flowRuntime2.default.property('dm', ActionHandlersType), _flowRuntime2.default.property('channel', ActionHandlersType), _flowRuntime2.default.property('group', ActionHandlersType)));

exports.default = function createActionHandlersMap(actions) {
  let _actionsType = _flowRuntime2.default.array(_flowRuntime2.default.ref(ActionType));

  const _returnType = _flowRuntime2.default.return(ActionsMapType);

  _flowRuntime2.default.param('actions', _actionsType).assert(actions);

  const map = ActionsMapType.assert({
    dm: { commands: new Map(), regexps: [] },
    channel: { commands: new Map(), regexps: [] },
    group: { commands: new Map(), regexps: [] }
  });

  actions.forEach(action => {
    let _actionType = _flowRuntime2.default.ref(ActionType);

    _flowRuntime2.default.param('action', _actionType).assert(action);

    if (!action.where) action.where = ['dm', 'channel', 'group'];
    if (!action.mention) action.mention = action.where.filter(v => v !== 'dm');
    if (!action.handler) action.handler = (0, _koaCompose2.default)(action.middlewares);
    if (action.stop !== false) action.stop = true;

    action.where.forEach(where => {
      const commands = _flowRuntime2.default.ref('Map', _flowRuntime2.default.string(), _flowRuntime2.default.ref(ActionType)).assert(map[where].commands);
      const regexps = _flowRuntime2.default.array(_flowRuntime2.default.ref(ActionType)).assert(map[where].regexps);

      if (action.commands) {
        action.commands.forEach(command => {
          let _commandType = _flowRuntime2.default.string();

          _flowRuntime2.default.param('command', _commandType).assert(command);

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

  return _returnType.assert(map);
};
//# sourceMappingURL=createActionHandlersMap.js.map