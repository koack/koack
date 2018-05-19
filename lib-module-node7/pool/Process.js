import { fork } from 'child_process';
let Process = class {

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
    this.childProcess = fork(require.resolve('./bot-process'), [this.id, path], {
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

    this.childProcess.send({ type: 'message', teamId, data });
  }
};
export { Process as default };
//# sourceMappingURL=Process.js.map