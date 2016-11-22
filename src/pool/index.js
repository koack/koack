import Logger from 'nightingale/src';
import startBot from './startBot';
import { processes, teamsToProcess } from './Process';
import type { TeamType } from '../types';

const logger = new Logger('koack:pool');

type PoolOptionsType = {|
  size: number,
  path: string,
|};

export default class Pool {
  size: number;
  path: string;
  _id = 1;
  processes = new Set();
  teamsToProcess = new Map();

  constructor(options: PoolOptionsType) {
    Object.assign(options);
  }

  async start(iterator) {
    logger.info('bot server is starting');

    for (const item of iterator) {
      const team = await item;
      await startBot(team);
    }
  }

  sendBotMessage(teamId: number, data: Object) {
    if (!teamsToProcess.has(teamId)) {
      logger.warn('No team', { teamId });
      return;
    }

    teamsToProcess.get(teamId).sendMessage(teamId, data);
  }

  close() {
    this.processes.forEach(process => process.kill());
  }
}
