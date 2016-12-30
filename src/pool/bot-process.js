import 'nightingale-app-console';
import Logger from 'nightingale-logger/src';
import { createBot } from '../bot';
import type Bot from '../bot/Bot';
import type { TeamType } from '../types';

const logger = new Logger('koack:pool');

console.log(process.argv);
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
      const { team }: { team: TeamType } = message;
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

    default: {
      logger.warn('Unsupported message', message);
    }
  }
});
