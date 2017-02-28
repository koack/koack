import { fork } from 'child_process';
import { ChildProcess as _ChildProcess } from 'child_process';
import Pool from './index';
import { TeamType as _TeamType } from '../../types';

import t from 'flow-runtime';
const TeamType = t.tdz(() => _TeamType);
const ChildProcess = t.tdz(() => _ChildProcess);
export default class Process {

  constructor(pool) {
    let _poolType = t.ref(Pool);

    t.param('pool', _poolType).assert(pool);

    this.pool = pool;
    this.id = pool.processNextId++;
    this.teams = new Map();
  }

  start() {
    if (this.childProcess) {
      throw new Error('Already started');
    }

    const path = t.string().assert(this.pool.path);
    this.childProcess = fork(require.resolve('./bot-process'), [this.id, path], {
      env: Object.assign({}, process.env, {
        CHILD_ID: this.id
      })
    });
  }

  kill() {
    if (!this.childProcess) return;
    return new Promise(resolve => {
      this.childProcess.once('exit', () => resolve());
      this.childProcess.kill();
      delete this.childProcess;
    });
  }

  canAddTeam() {
    return this.teams.size < this.pool.size;
  }

  startTeam(team) {
    let _teamType = t.ref(TeamType);

    t.param('team', _teamType).assert(team);

    if (!this.childProcess) {
      throw new Error('Cannot start a new team in a killed process');
    }

    this.teams.set(team.id, team);
    this.pool.teamsToProcess.set(team.id, this);

    this.childProcess.send({ type: 'start', team });
  }

  killTeam(team, killProcessIfEmpty = true) {
    let _teamType2 = t.ref(TeamType);

    let _killProcessIfEmptyType = t.boolean();

    t.param('team', _teamType2).assert(team);
    t.param('killProcessIfEmpty', _killProcessIfEmptyType).assert(killProcessIfEmpty);

    if (!this.childProcess) {
      throw new Error('Cannot kill a team in a killed process');
    }

    this.childProcess.send({ type: 'remove', teamId: team.id });
    this.teams.delete(team.id);
    this.pool.teamsToProcess.delete(team.id);

    if (killProcessIfEmpty && this.teams.size === 0) {
      this.kill();
      this.pool.processes.delete(this);
    }
  }

  replaceTeam(team) {
    let _teamType3 = t.ref(TeamType);

    t.param('team', _teamType3).assert(team);

    this.killTeam(team, false);
    this.startTeam(team);
  }

  sendMessage(teamId, data) {
    let _teamIdType = t.number();

    let _dataType = t.object();

    t.param('teamId', _teamIdType).assert(teamId);
    t.param('data', _dataType).assert(data);

    if (!this.childProcess) {
      throw new Error('Cannot send a message in a killed process');
    }

    this.childProcess.send(Object.assign({ type: 'message', teamId }, data));
  }
}
//# sourceMappingURL=Process.js.map