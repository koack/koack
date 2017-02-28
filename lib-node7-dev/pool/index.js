'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _nightingale = require('nightingale');

var _nightingale2 = _interopRequireDefault(_nightingale);

var _startBot = require('./startBot');

var _startBot2 = _interopRequireDefault(_startBot);

var _types = require('../types/');

var _flowRuntime = require('flow-runtime');

var _flowRuntime2 = _interopRequireDefault(_flowRuntime);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const TeamType = _flowRuntime2.default.tdz(() => _types.TeamType);

const logger = new _nightingale2.default('koack:pool');

const PoolOptionsType = _flowRuntime2.default.type('PoolOptionsType', _flowRuntime2.default.exactObject(_flowRuntime2.default.property('size', _flowRuntime2.default.number()), _flowRuntime2.default.property('path', _flowRuntime2.default.string())));

class Pool {

  constructor(options) {
    this.processNextId = 1;
    this.teamsToProcess = new Map();

    _flowRuntime2.default.param('options', PoolOptionsType).assert(options);

    Object.assign(this, options);
  }

  addTeam(team) {
    let _teamType = _flowRuntime2.default.ref(TeamType);

    _flowRuntime2.default.param('team', _teamType).assert(team);

    (0, _startBot2.default)(this, team);
  }

  sendBotMessage(teamId, data) {
    let _teamIdType = _flowRuntime2.default.number();

    let _dataType = _flowRuntime2.default.object();

    _flowRuntime2.default.param('teamId', _teamIdType).assert(teamId);

    _flowRuntime2.default.param('data', _dataType).assert(data);

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
exports.default = Pool;
//# sourceMappingURL=index.js.map