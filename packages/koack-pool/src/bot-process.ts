
import 'nightingale-app-console';
import Logger from 'nightingale-logger';
import { Team } from 'koack-types';
import { createBot, Bot } from 'koack-bot';

const logger = new Logger('koack:pool');

const id: number = Number(process.argv[2]);
// eslint-disable-next-line import/no-dynamic-require
const initBot: Function = require(process.argv[3]).default;

logger.setContext({ id });

const teams: Map<any, Bot> = new Map();

process.on('message', message => {
  if (typeof message !== 'object') {
    logger.error('Unexpected message', message);
  }

  switch (message.type) {
    case 'start': {
      const { team }: { team: Team } = message;
      if (!team.id) throw new Error('Invalid team.id');

      const bot = createBot(team);
      teams.set(team.id, bot);
      initBot(bot);

      break;
    }

    case 'remove': {
      const { teamId }: { teamId: string } = message;
      if (!teams.has(teamId)) {
        logger.warn('Unexpected team id', { teamId });
        return;
      }

      const bot: Bot = teams.get(teamId);
      bot.close();
      break;
    }

    case 'message': {
      const { teamId, data }: { teamId: string, data: object } = message;
      if (!teamId) throw new Error('Invalid teamId');
      const bot: Bot = teams.get(teamId);
      bot.messageReceived(data);
      break;
    }

    default: {
      logger.warn('Unsupported message', message);
    }
  }
});
