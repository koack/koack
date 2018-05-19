import 'nightingale-app-console';
import Logger from 'nightingale-logger';
import { createBot } from '../bot';
import _Bot from '../bot/Bot';
import { TeamType as _TeamType } from '../types';

import t from 'flow-runtime';
const TeamType = t.tdz(() => _TeamType);
const Bot = t.tdz(() => _Bot);
const logger = new Logger('koack:pool');

const id = t.number().assert(Number(process.argv[2]));
// eslint-disable-next-line import/no-dynamic-require
const initBot = t.function().assert(require(process.argv[3]).default);

logger.setContext({ id });

const teams = t.ref('Map', t.any(), t.ref(Bot)).assert(new Map());

process.on('message', message => {
  if (typeof message !== 'object') {
    logger.error('Unexpected message', message);
  }

  switch (message.type) {
    case 'start':
      {
        const { team } = t.object(t.property('team', t.ref(TeamType))).assert(message);
        if (!team.id) throw new Error('Invalid team.id');

        const bot = createBot(team);
        teams.set(team.id, bot);
        initBot(bot);

        break;
      }

    case 'remove':
      {
        const { teamId } = t.object(t.property('teamId', t.string())).assert(message);
        if (!teams.has(teamId)) {
          logger.warn('Unexpected team id', { teamId });
          return;
        }

        const bot = t.ref(Bot).assert(teams.get(teamId));
        bot.close();
        break;
      }

    case 'message':
      {
        const { teamId, data } = t.object(t.property('teamId', t.string())).assert(message);
        if (!teamId) throw new Error('Invalid teamId');
        const bot = t.ref(Bot).assert(teams.get(teamId));
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