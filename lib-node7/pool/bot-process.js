'use strict';

require('nightingale-app-console');

var _nightingaleLogger = require('nightingale-logger');

var _nightingaleLogger2 = _interopRequireDefault(_nightingaleLogger);

var _bot = require('../bot');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const logger = new _nightingaleLogger2.default('koack:pool');


const id = Number(process.argv[2]);
// eslint-disable-next-line import/no-dynamic-require
const initBot = require(process.argv[3]).default;

logger.setContext({ id });

const teams = new Map();

process.on('message', message => {
  if (typeof message !== 'object') {
    logger.error('Unexpected message', message);
  }

  switch (message.type) {
    case 'start':
      {
        const { team } = message;
        if (!team.id) throw new Error('Invalid team.id');

        const bot = (0, _bot.createBot)(team);
        teams.set(team.id, bot);
        initBot(bot);

        break;
      }

    case 'remove':
      {
        const { teamId } = message;
        if (!teams.has(teamId)) {
          logger.warn('Unexpected team id', { teamId });
          return;
        }

        const bot = teams.get(teamId);
        bot.close();
        break;
      }

    default:
      {
        logger.warn('Unsupported message', message);
      }
  }
});
//# sourceMappingURL=bot-process.js.map