'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _koaCompose = require('koa-compose');

var _koaCompose2 = _interopRequireDefault(_koaCompose);

var _nightingaleLogger = require('nightingale-logger');

var _nightingaleLogger2 = _interopRequireDefault(_nightingaleLogger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const logger = new _nightingaleLogger2.default('koack:message-router:actions');

exports.default = actions => {
  const map = {
    dm: { commands: new Map(), regexps: [] },
    channel: { commands: new Map(), regexps: [] },
    group: { commands: new Map(), regexps: [] }
  };

  actions.forEach(action => {
    if (!action.where) action.where = ['dm', 'channel', 'group'];
    if (!action.mention) action.mention = action.where.filter(v => v !== 'dm');
    if (!action.handler) action.handler = (0, _koaCompose2.default)(action.middlewares);
    if (action.stop !== false) action.stop = true;

    action.where.forEach(where => {
      const commands = map[where].commands;
      const regexps = map[where].regexps;

      if (action.commands) {
        action.commands.forEach(command => {
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
//# sourceMappingURL=createActionHandlersMap.js.map