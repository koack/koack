
import { fork } from 'child_process';
import { ChildProcess } from 'child_process';
import Pool from './index';
import { TeamId, Team } from 'koack-types';

export default class Process {
  pool: Pool;
  id: number;
  teams: Map<any, Team>;
  childProcess?: ChildProcess;

  constructor(pool: Pool) {
    this.pool = pool;
    this.id = pool.processNextId++;
    this.teams = new Map();
  }

  start(): void {
    if (this.childProcess) {
      throw new Error('Already started');
    }

    const path: string = this.pool.path;
    this.childProcess = fork(require.resolve('./bot-process'), [String(this.id), path], {
      env: {
        ...process.env,
        CHILD_ID: this.id,
      },
    });
  }

  kill(): Promise<void> {
    return new Promise(resolve => {
      if (!this.childProcess) return resolve();
      this.childProcess.once('exit', () => resolve());
      this.childProcess.kill();
      delete this.childProcess;
    });
  }

  canAddTeam(): boolean {
    return this.teams.size < this.pool.size;
  }

  startTeam(team: Team): void {
    if (!this.childProcess) {
      throw new Error('Cannot start a new team in a killed process');
    }

    this.teams.set(team.id, team);
    this.pool.teamsToProcess.set(team.id, this);

    this.childProcess.send({ type: 'start', team });
  }

  killTeam(team: Team, killProcessIfEmpty: boolean = true): void {
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

  replaceTeam(team: Team): void {
    this.killTeam(team, false);
    this.startTeam(team);
  }

  sendMessage(teamId: TeamId, data: Object): void {
    if (!this.childProcess) {
      throw new Error('Cannot send a message in a killed process');
    }

    this.childProcess.send({ type: 'message', teamId, data });
  }
}
