import Logger from 'nightingale/src';
import Process from './Process';
import type { TeamType } from '../types';

const logger = new Logger('koack:pool');

export function startBot(pool, team: TeamType) {
  logger.info('starting bot', team);

  if (teamsToProcess.has(team.id)) {
    logger.warn('bot already started', team);
    pool.teamsToProcess.get(team.id).replaceTeam(team, status);
    return;
  }

  for (let process of pool.processes) {
    if (process.canAddTeam()) {
      process.startTeam(team, status);
      return;
    }
  }

  const newProcess = new Process(pool);
  pool.processes.add(newProcess);
  logger.info('adding new process', { newProcessListSize: pool.processes.size });
  newProcess.start();
  newProcess.startTeam(team, status);
}
