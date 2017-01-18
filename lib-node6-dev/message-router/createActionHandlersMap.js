'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _arguments = arguments;

var _tcombForked = require('tcomb-forked');

var _tcombForked2 = _interopRequireDefault(_tcombForked);

var _koaCompose = require('koa-compose');

var _koaCompose2 = _interopRequireDefault(_koaCompose);

var _nightingaleLogger = require('nightingale-logger');

var _nightingaleLogger2 = _interopRequireDefault(_nightingaleLogger);

var _types = require('./types');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const logger = new _nightingaleLogger2.default('koack:message-router:actions');

const ActionHandlersType = _tcombForked2.default.interface({
  commands: Map,
  regexps: _tcombForked2.default.list(_types.ActionType)
}, 'ActionHandlersType');

const ActionsMapType = _tcombForked2.default.interface({
  dm: ActionHandlersType,
  channel: ActionHandlersType,
  group: ActionHandlersType
}, 'ActionsMapType');

exports.default = function createActionHandlersMap(actions) {
  _assert(actions, _tcombForked2.default.list(_types.ActionType), 'actions');

  return _assert(function () {
    const map = _assert({
      dm: { commands: new Map(), regexps: [] },
      channel: { commands: new Map(), regexps: [] },
      group: { commands: new Map(), regexps: [] }
    }, ActionsMapType, 'map');

    actions.forEach(action => {
      _assert(action, _types.ActionType, 'action');

      if (!action.where) action.where = ['dm', 'channel', 'group'];
      if (!action.mention) action.mention = action.where.filter(v => v !== 'dm');
      if (!action.handler) action.handler = (0, _koaCompose2.default)(action.middlewares);
      if (action.stop !== false) action.stop = true;

      action.where.forEach(where => {
        const commands = map[where].commands;
        const regexps = map[where].regexps;

        if (action.commands) {
          action.commands.forEach(command => {
            _assert(command, _tcombForked2.default.String, 'command');

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
  }.apply(undefined, _arguments), ActionsMapType, 'return value');
};

function _assert(x, type, name) {
  if (false) {
    _tcombForked2.default.fail = function (message) {
      console.warn(message);
    };
  }

  if (_tcombForked2.default.isType(type) && type.meta.kind !== 'struct') {
    if (!type.is(x)) {
      type(x, [name + ': ' + _tcombForked2.default.getTypeName(type)]);
    }
  } else if (!(x instanceof type)) {
    _tcombForked2.default.fail('Invalid value ' + _tcombForked2.default.stringify(x) + ' supplied to ' + name + ' (expected a ' + _tcombForked2.default.getTypeName(type) + ')');
  }

  return x;
}
//# sourceMappingURL=createActionHandlersMap.js.map