import { fork } from 'child_process';
import type { TeamType } from '../../src/types';

export default class Process {
  constructor(pool) {
    this._pool = pool;
    this._id = pool._id++;
    this._teams = new Map();
  }

  start() {
    if (this._childProcess) {
      throw new Error('Already started');
    }

    this._childProcess = fork(require.resolve('./bot-process'), [pool._path, this._id], {
      env: {
        ...process.env,
        CHILD_ID: this._id,
      },
    });
  }

  kill() {
    this._childProcess.kill();
    delete this._childProcess;
  }

  canAddTeam() {
    return this._teams.size < MAX_TEAMS_PER_PROCESS;
  }

  startTeam(team: TeamType) {
    this._teams.set(team.id, team);
    this._pool.teamsToProcess.set(team.id, this);

    this._childProcess.send({ type: 'start', team });
  }

  killTeam(team: TeamType, killProcessIfEmpty = true) {
    this._childProcess.send({ type: 'remove', teamId: team.id });
    this._teams.delete(team.id);
    this._pool.teamsToProcess.delete(team.id);

    if (killProcessIfEmpty && this._teams.size === 0) {
      this.kill();
      this._pool.processes.delete(this);
    }
  }

  replaceTeam(team: TeamType) {
    this.killTeam(team, false);
    this.startTeam(team);
  }

  sendMessage(teamId: number, data: Object) {
    this._childProcess.send({ type: 'message', teamId, ...data });
  }
}
