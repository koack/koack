import Logger from 'nightingale';
import startBot from './startBot';


const logger = new Logger('koack:pool');

let Pool = class {

  constructor(options) {
    this.processNextId = 1;
    this.processes = new Set();
    this.teamsToProcess = new Map();

    Object.assign(this, options);
  }

  addTeam(team) {
    startBot(this, team);
  }

  sendBotMessage(teamId, data) {
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
};
export { Pool as default };
//# sourceMappingURL=index.js.map