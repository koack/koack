'use strict';

require('nightingale-app-console');

var _nightingaleLogger = require('nightingale-logger');

var _nightingaleLogger2 = _interopRequireDefault(_nightingaleLogger);

var _bot = require('../bot');

var _Bot2 = require('../bot/Bot');

var _Bot3 = _interopRequireDefault(_Bot2);

var _types = require('../types');

var _flowRuntime = require('flow-runtime');

var _flowRuntime2 = _interopRequireDefault(_flowRuntime);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const TeamType = _flowRuntime2.default.tdz(() => _types.TeamType);

const Bot = _flowRuntime2.default.tdz(() => _Bot3.default);

const logger = new _nightingaleLogger2.default('koack:pool');

const id = _flowRuntime2.default.number().assert(Number(process.argv[2]));
// eslint-disable-next-line import/no-dynamic-require
const initBot = _flowRuntime2.default.function().assert(require(process.argv[3]).default);

logger.setContext({ id });

const teams = _flowRuntime2.default.ref('Map', _flowRuntime2.default.any(), _flowRuntime2.default.ref(Bot)).assert(new Map());

process.on('message', message => {
  if (typeof message !== 'object') {
    logger.error('Unexpected message', message);
  }

  switch (message.type) {
    case 'start':
      {
        const { team } = _flowRuntime2.default.object(_flowRuntime2.default.property('team', _flowRuntime2.default.ref(TeamType))).assert(message);
        if (!team.id) throw new Error('Invalid team.id');

        const bot = (0, _bot.createBot)(team);
        teams.set(team.id, bot);
        initBot(bot);

        break;
      }

    case 'remove':
      {
        const { teamId } = _flowRuntime2.default.object(_flowRuntime2.default.property('teamId', _flowRuntime2.default.string())).assert(message);
        if (!teams.has(teamId)) {
          logger.warn('Unexpected team id', { teamId });
          return;
        }

        const bot = _flowRuntime2.default.ref(Bot).assert(teams.get(teamId));
        bot.close();
        break;
      }

    case 'message':
      {
        const { teamId, data } = _flowRuntime2.default.object(_flowRuntime2.default.property('teamId', _flowRuntime2.default.string())).assert(message);
        if (!teamId) throw new Error('Invalid teamId');
        const bot = _flowRuntime2.default.ref(Bot).assert(teams.get(teamId));
        bot.messageReceived(data);
        break;
      }

    default:
      {
        logger.warn('Unsupported message', message);
      }
  }
});
//# sourceMappingURL=bot-process.js.map