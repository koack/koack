'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = startBot;

var _nightingale = require('nightingale');

var _nightingale2 = _interopRequireDefault(_nightingale);

var _Process = require('./Process');

var _Process2 = _interopRequireDefault(_Process);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const logger = new _nightingale2.default('koack:pool');

function startBot(pool, team) {
  logger.info('starting bot', team);

  if (pool.teamsToProcess.has(team.id)) {
    logger.warn('bot already started', team);
    pool.teamsToProcess.get(team.id).replaceTeam(team);
    return;
  }

  // eslint-disable-next-line no-restricted-syntax
  for (let process of pool.processes) {
    if (process.canAddTeam()) {
      process.startTeam(team);
      return;
    }
  }

  const newProcess = new _Process2.default(pool);
  pool.processes.add(newProcess);
  logger.info('adding new process', { newProcessListSize: pool.processes.size });
  newProcess.start();
  newProcess.startTeam(team);
}
//# sourceMappingURL=startBot.js.map