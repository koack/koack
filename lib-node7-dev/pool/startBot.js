'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = startBot;

var _nightingale = require('nightingale');

var _nightingale2 = _interopRequireDefault(_nightingale);

var _Process = require('./Process');

var _Process2 = _interopRequireDefault(_Process);

var _index = require('./index');

var _index2 = _interopRequireDefault(_index);

var _types = require('../types');

var _flowRuntime = require('flow-runtime');

var _flowRuntime2 = _interopRequireDefault(_flowRuntime);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const TeamType = _flowRuntime2.default.tdz(() => _types.TeamType);

const logger = new _nightingale2.default('koack:pool');

function startBot(pool, team) {
  let _poolType = _flowRuntime2.default.ref(_index2.default);

  let _teamType = _flowRuntime2.default.ref(TeamType);

  const _returnType = _flowRuntime2.default.return(_flowRuntime2.default.void());

  _flowRuntime2.default.param('pool', _poolType).assert(pool);

  _flowRuntime2.default.param('team', _teamType).assert(team);

  logger.info('starting bot', team);

  if (pool.teamsToProcess.has(team.id)) {
    logger.warn('bot already started', team);
    pool.teamsToProcess.get(team.id).replaceTeam(team);
    return _returnType.assert();
  }

  // eslint-disable-next-line no-restricted-syntax
  for (let process of pool.processes) {
    if (process.canAddTeam()) {
      process.startTeam(team);
      return _returnType.assert();
    }
  }

  const newProcess = new _Process2.default(pool);
  pool.processes.add(newProcess);
  logger.info('adding new process', { newProcessListSize: pool.processes.size });
  newProcess.start();
  newProcess.startTeam(team);
}
//# sourceMappingURL=startBot.js.map