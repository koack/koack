'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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
    if (!this.childProcess) {
      throw new Error('Cannot start a new team in a killed process');
    }

    this.teams.set(team.id, team);
    this.pool.teamsToProcess.set(team.id, this);

    this.childProcess.send({ type: 'start', team });
  }

  killTeam(team, killProcessIfEmpty = true) {
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
    this.killTeam(team, false);
    this.startTeam(team);
  }

  sendMessage(teamId, data) {
    if (!this.childProcess) {
      throw new Error('Cannot send a message in a killed process');
    }

    this.childProcess.send(Object.assign({ type: 'message', teamId }, data));
  }
}
exports.default = Process;
//# sourceMappingURL=Process.js.map