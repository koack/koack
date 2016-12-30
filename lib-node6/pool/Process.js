'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _child_process = require('child_process');

class Process {

  constructor(pool) {
    this.pool = pool;
    this.id = pool.processNextId++;
    this.teams = new Map();
  }

  start() {
    if (this.childProcess) {
      throw new Error('Already started');
    }

    const path = this.pool.path;
    this.childProcess = (0, _child_process.fork)(require.resolve('./bot-process'), [this.id, path], {
      env: _extends({}, process.env, {
        CHILD_ID: this.id
      })
    });
  }

  kill() {
    this.childProcess.kill();
    delete this.childProcess;
  }

  canAddTeam() {
    return this.teams.size < this.pool.size;
  }

  startTeam(team) {
    this.teams.set(team.id, team);
    this.pool.teamsToProcess.set(team.id, this);

    this.childProcess.send({ type: 'start', team });
  }

  killTeam(team, killProcessIfEmpty = true) {
    this.childProcess.send({ type: 'remove', teamId: team.id });
    this.teams.delete(team.id);
    this.pool.teamsToProcess.delete(team.id);

    if (killProcessIfEmpty && this.teams.size === 0) {
      this.kill();
      this.pool.processes.delete(this);
    }
  }

  replaceTeam(team) {
    this.killTeam(team, false);
    this.startTeam(team);
  }

  sendMessage(teamId, data) {
    this.childProcess.send(_extends({ type: 'message', teamId }, data));
  }
}
exports.default = Process;
//# sourceMappingURL=Process.js.map