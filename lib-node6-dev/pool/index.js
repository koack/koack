'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _dec, _dec2, _dec3, _desc, _value, _class, _descriptor, _descriptor2, _descriptor3;

var _nightingale = require('nightingale');

var _nightingale2 = _interopRequireDefault(_nightingale);

var _startBot = require('./startBot');

var _startBot2 = _interopRequireDefault(_startBot);

var _types = require('../types/');

var _Process = require('./Process');

var _Process2 = _interopRequireDefault(_Process);

var _flowRuntime = require('flow-runtime');

var _flowRuntime2 = _interopRequireDefault(_flowRuntime);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

const TeamType = _flowRuntime2.default.tdz(() => _types.TeamType);

const TeamIdType = _flowRuntime2.default.tdz(() => _types.TeamIdType);

const logger = new _nightingale2.default('koack:pool');

const PoolOptionsType = _flowRuntime2.default.type('PoolOptionsType', _flowRuntime2.default.exactObject(_flowRuntime2.default.property('size', _flowRuntime2.default.number()), _flowRuntime2.default.property('path', _flowRuntime2.default.string())));

let Pool = (_dec = _flowRuntime2.default.decorate(_flowRuntime2.default.number()), _dec2 = _flowRuntime2.default.decorate(_flowRuntime2.default.string()), _dec3 = _flowRuntime2.default.decorate(function () {
  return _flowRuntime2.default.ref('Set', _flowRuntime2.default.ref(_Process2.default));
}), (_class = class {

  constructor(options) {
    _initDefineProp(this, 'size', _descriptor, this);

    _initDefineProp(this, 'path', _descriptor2, this);

    this.processNextId = 1;

    _initDefineProp(this, 'processes', _descriptor3, this);

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
    let _teamIdType = _flowRuntime2.default.ref(TeamIdType);

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
exports.default = Pool;
//# sourceMappingURL=index.js.map