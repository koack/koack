import Logger from 'nightingale';
import Process from './Process';


const logger = new Logger('koack:pool');

export default function startBot(pool, team) {
  logger.info('starting bot', team);

  if (pool.teamsToProcess.has(team.id)) {
    logger.warn('bot already started', team);
    pool.teamsToProcess.get(team.id).replaceTeam(team);
    return;
  }

  // eslint-disable-next-line no-restricted-syntax
  for (let process of pool.processes) {
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
//# sourceMappingURL=startBot.js.map