/* @flow */
import Logger from 'nightingale/src';
import startBot from './startBot';
import type { TeamType } from '../types/';

const logger = new Logger('koack:pool');

type PoolOptionsType = {|
  size: number,
  path: string,
|};

export default class Pool {
  size: number;
  path: string;
  processNextId = 1;
  processes = new Set();
  teamsToProcess = new Map();

  constructor(options: PoolOptionsType) {
    Object.assign(this, options);
  }

  addTeam(team: TeamType) {
    startBot(this, team);
  }

  sendBotMessage(teamId: number, data: Object) {
    const process = this.teamsToProcess.get(teamId);
    if (!process) {
      logger.warn('No team', { teamId });
      return;
    }
    process.sendMessage(teamId, data);
  }

  close() {
    this.processes.forEach(process => process.kill());
  }
}
