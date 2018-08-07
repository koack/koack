
import Logger from 'nightingale-logger';
import { Team, TeamId } from 'koack-types';
import startBot from './startBot';
import Process from './Process';

const logger = new Logger('koack:pool');

export interface PoolOptions {
  size: number,
  path: string,
};

export default class Pool {
  size: number;
  path: string;
  processNextId = 1;
  processes: Set<Process> = new Set();
  teamsToProcess = new Map();

  constructor(options: PoolOptions) {
    this.size = options.size;
    this.path = options.path;
  }

  addTeam(team: Team) {
    startBot(this, team);
  }

  sendBotMessage(teamId: TeamId, data: Object) {
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
