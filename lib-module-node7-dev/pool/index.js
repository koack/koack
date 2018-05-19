var _dec, _dec2, _dec3, _desc, _value, _class, _descriptor, _descriptor2, _descriptor3;

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

import Logger from 'nightingale';
import startBot from './startBot';
import { TeamType as _TeamType, TeamIdType as _TeamIdType } from '../types/';
import Process from './Process';

import t from 'flow-runtime';
const TeamType = t.tdz(() => _TeamType);
const TeamIdType = t.tdz(() => _TeamIdType);
const logger = new Logger('koack:pool');

const PoolOptionsType = t.type('PoolOptionsType', t.exactObject(t.property('size', t.number()), t.property('path', t.string())));
let Pool = (_dec = t.decorate(t.number()), _dec2 = t.decorate(t.string()), _dec3 = t.decorate(function () {
  return t.ref('Set', t.ref(Process));
}), (_class = class {

  constructor(options) {
    _initDefineProp(this, 'size', _descriptor, this);

    _initDefineProp(this, 'path', _descriptor2, this);

    this.processNextId = 1;

    _initDefineProp(this, 'processes', _descriptor3, this);

    this.teamsToProcess = new Map();
    t.param('options', PoolOptionsType).assert(options);

    Object.assign(this, options);
  }

  addTeam(team) {
    let _teamType = t.ref(TeamType);

    t.param('team', _teamType).assert(team);

    startBot(this, team);
  }

  sendBotMessage(teamId, data) {
    let _teamIdType = t.ref(TeamIdType);

    let _dataType = t.object();

    t.param('teamId', _teamIdType).assert(teamId);
    t.param('data', _dataType).assert(data);

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
}, (_descriptor = _applyDecoratedDescriptor(_class.prototype, 'size', [_dec], {
  enumerable: true,
  initializer: null
}), _descriptor2 = _applyDecoratedDescriptor(_class.prototype, 'path', [_dec2], {
  enumerable: true,
  initializer: null
}), _descriptor3 = _applyDecoratedDescriptor(_class.prototype, 'processes', [_dec3], {
  enumerable: true,
  initializer: function () {
    return new Set();
  }
})), _class));
export { Pool as default };
//# sourceMappingURL=index.js.map