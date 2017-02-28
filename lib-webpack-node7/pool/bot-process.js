import 'nightingale-app-console';
import Logger from 'nightingale-logger';
import { createBot } from '../bot';


const logger = new Logger('koack:pool');

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

        const bot = createBot(team);
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