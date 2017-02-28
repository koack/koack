import Logger from 'nightingale';
import startBot from './startBot';
import { TeamType as _TeamType } from '../types/';
import t from 'flow-runtime';
const TeamType = t.tdz(() => _TeamType);


const logger = new Logger('koack:pool');

const PoolOptionsType = t.type('PoolOptionsType', t.exactObject(t.property('size', t.number()), t.property('path', t.string())));


export default class Pool {

  constructor(options) {
    this.processNextId = 1;
    this.teamsToProcess = new Map();
    t.param('options', PoolOptionsType).assert(options);

    Object.assign(this, options);
  }

  addTeam(team) {
    let _teamType = t.ref(TeamType);

    t.param('team', _teamType).assert(team);

    startBot(this, team);
  }

  sendBotMessage(teamId, data) {
    let _teamIdType = t.number();

    let _dataType = t.object();

    t.param('teamId', _teamIdType).assert(teamId);
    t.param('data', _dataType).assert(data);

    const process = this.teamsToProcess.get(teamId);
    if (!process) {
      logger.warn('No team', { teamId });
      return;
    }
    process.sendMessage(teamId, data);
  }

  close() {
    return this.clear();
  }

  clear() {
    const promises = Array.from(this.processes).map(process => process.kill());
    this.processes.clear();
    this.teamsToProcess.clear();
    this.processNextId = 1;
    return Promise.all(promises);
  }
}
//# sourceMappingURL=index.js.map