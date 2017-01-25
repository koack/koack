'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _nightingale = require('nightingale');

var _nightingale2 = _interopRequireDefault(_nightingale);

var _startBot = require('./startBot');

var _startBot2 = _interopRequireDefault(_startBot);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const logger = new _nightingale2.default('koack:pool');

class Pool {

  constructor(options) {
    this.processNextId = 1;
    this.processes = new Set();
    this.teamsToProcess = new Map();

    Object.assign(this, options);
  }

  addTeam(team) {
    (0, _startBot2.default)(this, team);
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
    const promises = Array.from(this.processes).map(process => new Promise(resolve => {
      process.kill();
      process.once('exit', () => resolve());
    }));
    this.processes.clear();
    this.teamsToProcess.clear();
    this.processNextId = 1;
    return Promise.all(promises);
  }
}
exports.default = Pool;
//# sourceMappingURL=index.js.map