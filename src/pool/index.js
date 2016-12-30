import Logger from 'nightingale/src';
import startBot from './startBot';

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

  async start(iterator) {
    logger.info('bot server is starting');

    // eslint-disable-next-line no-restricted-syntax
    for (const item of iterator) {
      const installInfo = await item;
      await startBot(this, installInfo);
    }
  }

  addTeam(team) {
    startBot(this, team);
  }

  sendBotMessage(teamId: number, data: Object) {
    if (!this.teamsToProcess.has(teamId)) {
      logger.warn('No team', { teamId });
      return;
    }

    this.teamsToProcess.get(teamId).sendMessage(teamId, data);
  }

  close() {
    this.processes.forEach(process => process.kill());
  }
}
