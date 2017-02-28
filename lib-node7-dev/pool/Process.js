'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _child_process = require('child_process');

var _index = require('./index');

var _index2 = _interopRequireDefault(_index);

var _types = require('../../types');

var _flowRuntime = require('flow-runtime');

var _flowRuntime2 = _interopRequireDefault(_flowRuntime);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const TeamType = _flowRuntime2.default.tdz(() => _types.TeamType);

const ChildProcess = _flowRuntime2.default.tdz(() => _child_process.ChildProcess);

class Process {

  constructor(pool) {
    let _poolType = _flowRuntime2.default.ref(_index2.default);

    _flowRuntime2.default.param('pool', _poolType).assert(pool);

    this.pool = pool;
    this.id = pool.processNextId++;
    this.teams = new Map();
  }

  start() {
    if (this.childProcess) {
      throw new Error('Already started');
    }

    const path = _flowRuntime2.default.string().assert(this.pool.path);
    this.childProcess = (0, _child_process.fork)(require.resolve('./bot-process'), [this.id, path], {
      env: Object.assign({}, process.env, {
        CHILD_ID: this.id
      })
    });
  }

  kill() {
    if (!this.childProcess) return;
    return new Promise(resolve => {
      this.childProcess.once('exit', () => resolve());
      this.childProcess.kill();
      delete this.childProcess;
    });
  }

  canAddTeam() {
    return this.teams.size < this.pool.size;
  }

  startTeam(team) {
    let _teamType = _flowRuntime2.default.ref(TeamType);

    _flowRuntime2.default.param('team', _teamType).assert(team);

    if (!this.childProcess) {
      throw new Error('Cannot start a new team in a killed process');
    }

    this.teams.set(team.id, team);
    this.pool.teamsToProcess.set(team.id, this);

    this.childProcess.send({ type: 'start', team });
  }

  killTeam(team, killProcessIfEmpty = true) {
    let _teamType2 = _flowRuntime2.default.ref(TeamType);

    let _killProcessIfEmptyType = _flowRuntime2.default.boolean();

    _flowRuntime2.default.param('team', _teamType2).assert(team);

    _flowRuntime2.default.param('killProcessIfEmpty', _killProcessIfEmptyType).assert(killProcessIfEmpty);

    if (!this.childProcess) {
      throw new Error('Cannot kill a team in a killed process');
    }

    this.childProcess.send({ type: 'remove', teamId: team.id });
    this.teams.delete(team.id);
    this.pool.teamsToProcess.delete(team.id);

    if (killProcessIfEmpty && this.teams.size === 0) {
      this.kill();
      this.pool.processes.delete(this);
    }
  }

  replaceTeam(team) {
    let _teamType3 = _flowRuntime2.default.ref(TeamType);

    _flowRuntime2.default.param('team', _teamType3).assert(team);

    this.killTeam(team, false);
    this.startTeam(team);
  }

  sendMessage(teamId, data) {
    let _teamIdType = _flowRuntime2.default.number();

    let _dataType = _flowRuntime2.default.object();

    _flowRuntime2.default.param('teamId', _teamIdType).assert(teamId);

    _flowRuntime2.default.param('data', _dataType).assert(data);

    if (!this.childProcess) {
      throw new Error('Cannot send a message in a killed process');
    }

    this.childProcess.send(Object.assign({ type: 'message', teamId }, data));
  }
}
exports.default = Process;
//# sourceMappingURL=Process.js.map