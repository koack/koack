'use strict';

var _tcombForked = require('tcomb-forked');

var _tcombForked2 = _interopRequireDefault(_tcombForked);

require('nightingale-app-console');

var _nightingaleLogger = require('nightingale-logger');

var _nightingaleLogger2 = _interopRequireDefault(_nightingaleLogger);

var _bot = require('../bot');

var _Bot = require('../bot/Bot');

var _Bot2 = _interopRequireDefault(_Bot);

var _types = require('../types');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const logger = new _nightingaleLogger2.default('koack:pool');


const id = _assert(Number(process.argv[2]), _tcombForked2.default.Number, 'id');
// eslint-disable-next-line import/no-dynamic-require
const initBot = _assert(require(process.argv[3]).default, _tcombForked2.default.Function, 'initBot');

logger.setContext({ id });

const teams = _assert(new Map(), Map, 'teams');

process.on('message', message => {
  if (typeof message !== 'object') {
    logger.error('Unexpected message', message);
  }

  switch (message.type) {
    case 'start':
      {
        const { team } = _assert(message, _tcombForked2.default.interface({
          team: _types.TeamType
        }), '{ team }');
        if (!team.id) throw new Error('Invalid team.id');

        const bot = (0, _bot.createBot)(team);
        teams.set(team.id, bot);
        initBot(bot);

        break;
      }

    case 'remove':
      {
        const { teamId } = _assert(message, _tcombForked2.default.interface({
          teamId: _tcombForked2.default.String
        }), '{ teamId }');
        if (!teams.has(teamId)) {
          logger.warn('Unexpected team id', { teamId });
          return;
        }

        const bot = _assert(teams.get(teamId), _Bot2.default, 'bot');
        bot.close();
        break;
      }

    default:
      {
        logger.warn('Unsupported message', message);
      }
  }
});

function _assert(x, type, name) {
  function message() {
    return 'Invalid value ' + _tcombForked2.default.stringify(x) + ' supplied to ' + name + ' (expected a ' + _tcombForked2.default.getTypeName(type) + ')';
  }

  if (_tcombForked2.default.isType(type)) {
    if (!type.is(x)) {
      type(x, [name + ': ' + _tcombForked2.default.getTypeName(type)]);

      _tcombForked2.default.fail(message());
    }
  } else if (!(x instanceof type)) {
    _tcombForked2.default.fail(message());
  }

  return x;
}
//# sourceMappingURL=bot-process.js.map