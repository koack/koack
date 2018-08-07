import Logger from 'nightingale-logger';
import { Team } from 'koack-types';
import Process from './Process';
import Pool from './';

const logger = new Logger('koack:pool');

export default function startBot(pool: Pool, team: Team): void {
  logger.info('starting bot', team);

  if (pool.teamsToProcess.has(team.id)) {
    logger.warn('bot already started', team);
    pool.teamsToProcess.get(team.id).replaceTeam(team);
    return;
  }

  // eslint-disable-next-line no-restricted-syntax
  for (const process of pool.processes) {
    if (process.canAddTeam()) {
      process.startTeam(team);
      return;
    }
  }

  const newProcess = new Process(pool);
  pool.processes.add(newProcess);
  logger.info('adding new process', { newProcessListSize: pool.processes.size });
  newProcess.start();
  newProcess.startTeam(team);
}
