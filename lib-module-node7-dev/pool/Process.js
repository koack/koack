var _dec, _dec2, _dec3, _dec4, _desc, _value, _class, _descriptor, _descriptor2, _descriptor3, _descriptor4;

function _initDefineProp(target, property, descriptor, context) {
  if (!descriptor) return;
  Object.defineProperty(target, property, {
    enumerable: descriptor.enumerable,
    configurable: descriptor.configurable,
    writable: descriptor.writable,
    value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
  });
}

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
  var desc = {};
  Object['keys'](descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;

  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }

  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);

  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }

  if (desc.initializer === void 0) {
    Object['defineProperty'](target, property, desc);
    desc = null;
  }

  return desc;
}

function _initializerWarningHelper() {
  throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
}

import { fork } from 'child_process';
import { ChildProcess as _ChildProcess } from 'child_process';
import Pool from './index';
import { TeamIdType as _TeamIdType, TeamType as _TeamType } from '../../types';

import t from 'flow-runtime';
const TeamIdType = t.tdz(() => _TeamIdType);
const TeamType = t.tdz(() => _TeamType);
const ChildProcess = t.tdz(() => _ChildProcess);
let Process = (_dec = t.decorate(function () {
  return t.ref(Pool);
}), _dec2 = t.decorate(t.number()), _dec3 = t.decorate(t.ref('Map', t.any(), t.ref(TeamType))), _dec4 = t.decorate(t.nullable(t.ref(ChildProcess))), (_class = class {

  constructor(pool) {
    _initDefineProp(this, 'pool', _descriptor, this);

    _initDefineProp(this, 'id', _descriptor2, this);

    _initDefineProp(this, 'teams', _descriptor3, this);

    _initDefineProp(this, 'childProcess', _descriptor4, this);

    let _poolType = t.ref(Pool);

    t.param('pool', _poolType).assert(pool);

    this.pool = pool;
    this.id = pool.processNextId++;
    this.teams = new Map();
  }

  start() {
    if (this.childProcess) {
      throw new Error('Already started');
    }

    const path = t.string().assert(this.pool.path);
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
    let _teamType = t.ref(TeamType);

    t.param('team', _teamType).assert(team);

    if (!this.childProcess) {
      throw new Error('Cannot start a new team in a killed process');
    }

    this.teams.set(team.id, team);
    this.pool.teamsToProcess.set(team.id, this);

    this.childProcess.send({ type: 'start', team });
  }

  killTeam(team, killProcessIfEmpty = true) {
    let _teamType2 = t.ref(TeamType);

    let _killProcessIfEmptyType = t.boolean();

    t.param('team', _teamType2).assert(team);
    t.param('killProcessIfEmpty', _killProcessIfEmptyType).assert(killProcessIfEmpty);

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
    let _teamType3 = t.ref(TeamType);

    t.param('team', _teamType3).assert(team);

    this.killTeam(team, false);
    this.startTeam(team);
  }

  sendMessage(teamId, data) {
    let _teamIdType = t.ref(TeamIdType);

    let _dataType = t.object();

    t.param('teamId', _teamIdType).assert(teamId);
    t.param('data', _dataType).assert(data);

    if (!this.childProcess) {
      throw new Error('Cannot send a message in a killed process');
    }

    this.childProcess.send({ type: 'message', teamId, data });
  }
}, (_descriptor = _applyDecoratedDescriptor(_class.prototype, 'pool', [_dec], {
  enumerable: true,
  initializer: null
}), _descriptor2 = _applyDecoratedDescriptor(_class.prototype, 'id', [_dec2], {
  enumerable: true,
  initializer: null
}), _descriptor3 = _applyDecoratedDescriptor(_class.prototype, 'teams', [_dec3], {
  enumerable: true,
  initializer: null
}), _descriptor4 = _applyDecoratedDescriptor(_class.prototype, 'childProcess', [_dec4], {
  enumerable: true,
  initializer: null
})), _class));
export { Process as default };
//# sourceMappingURL=Process.js.map