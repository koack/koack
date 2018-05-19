/* @flow */
import Logger from 'nightingale/src';
import startBot from './startBot';
import type { TeamType, TeamIdType } from '../types/';
import Process from './Process';

const logger = new Logger('koack:pool');

type PoolOptionsType = {|
  size: number,
  path: string,
|};

export default class Pool {
  size: number;
  path: string;
  processNextId = 1;
  processes: Set<Process> = new Set();
  teamsToProcess = new Map();

  constructor(options: PoolOptionsType) {
    Object.assign(this, options);
  }

  addTeam(team: TeamType) {
    startBot(this, team);
  }

  sendBotMessage(teamId: TeamIdType, data: Object) {
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
