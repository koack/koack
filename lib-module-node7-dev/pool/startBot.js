import Logger from 'nightingale';
import Process from './Process';
import Pool from './index';
import { TeamType as _TeamType } from '../types';

import t from 'flow-runtime';
const TeamType = t.tdz(() => _TeamType);
const logger = new Logger('koack:pool');

export default function startBot(pool, team) {
  let _poolType = t.ref(Pool);

  let _teamType = t.ref(TeamType);

  const _returnType = t.return(t.void());

  t.param('pool', _poolType).assert(pool);
  t.param('team', _teamType).assert(team);

  logger.info('starting bot', team);

  if (pool.teamsToProcess.has(team.id)) {
    logger.warn('bot already started', team);
    pool.teamsToProcess.get(team.id).replaceTeam(team);
    return _returnType.assert();
  }

  // eslint-disable-next-line no-restricted-syntax
  for (let process of pool.processes) {
    if (process.canAddTeam()) {
      process.startTeam(team);
      return _returnType.assert();
    }
  }

  const newProcess = new Process(pool);
  pool.processes.add(newProcess);
  logger.info('adding new process', { newProcessListSize: pool.processes.size });
  newProcess.start();
  newProcess.startTeam(team);
}
//# sourceMappingURL=startBot.js.map