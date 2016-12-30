import { fork } from 'child_process';
import Pool from './index';
import type { TeamType } from '../../src/types';

export default class Process {
  pool: Pool;
  id: number;
  teams: Map<any, TeamType>;

  constructor(pool: Pool) {
    this.pool = pool;
    this.id = pool.processNextId++;
    this.teams = new Map();
  }

  start() {
    if (this.childProcess) {
      throw new Error('Already started');
    }

    const path: string = this.pool.path;
    this.childProcess = fork(require.resolve('./bot-process'), [this.id, path], {
      env: {
        ...process.env,
        CHILD_ID: this.id,
      },
    });
  }

  kill() {
    this.childProcess.kill();
    delete this.childProcess;
  }

  canAddTeam() {
    return this.teams.size < this.pool.size;
  }

  startTeam(team: TeamType) {
    this.teams.set(team.id, team);
    this.pool.teamsToProcess.set(team.id, this);

    this.childProcess.send({ type: 'start', team });
  }

  killTeam(team: TeamType, killProcessIfEmpty = true) {
    this.childProcess.send({ type: 'remove', teamId: team.id });
    this.teams.delete(team.id);
    this.pool.teamsToProcess.delete(team.id);

    if (killProcessIfEmpty && this.teams.size === 0) {
      this.kill();
      this.pool.processes.delete(this);
    }
  }

  replaceTeam(team: TeamType) {
    this.killTeam(team, false);
    this.startTeam(team);
  }

  sendMessage(teamId: number, data: Object) {
    this.childProcess.send({ type: 'message', teamId, ...data });
  }
}
