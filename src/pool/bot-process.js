import { createBot } from '../bot';
import type Bot from '../bot/Bot';

const id: number = Number(process.argv[2]);
const initBot: Function = require(process.argv[3]);

process.on('message', message => {
  if (typeof message !== 'object') {
    logger.error('Unexpected message', message);
  }

  switch (message.type) {
    case 'start': {
      const { team }: { team: TeamType } = message;

      const bot = createBot(team);
      teams.set(teamId, bot);
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
    }

    default: {
      logger.warn('Unsupported message', message);
    }
  }
});
