'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _tcombForked = require('tcomb-forked');

var _tcombForked2 = _interopRequireDefault(_tcombForked);

var _nightingale = require('nightingale');

var _nightingale2 = _interopRequireDefault(_nightingale);

var _startBot = require('./startBot');

var _startBot2 = _interopRequireDefault(_startBot);

var _types = require('../types/');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const logger = new _nightingale2.default('koack:pool');

const PoolOptionsType = _tcombForked2.default.interface({
  size: _tcombForked2.default.Number,
  path: _tcombForked2.default.String
}, {
  name: 'PoolOptionsType',
  strict: true
});

class Pool {

  constructor(options) {
    _assert(options, PoolOptionsType, 'options');

    this.processNextId = 1;
    this.processes = new Set();
    this.teamsToProcess = new Map();

    Object.assign(this, options);
  }

  addTeam(team) {
    _assert(team, _types.TeamType, 'team');

    (0, _startBot2.default)(this, team);
  }

  sendBotMessage(teamId, data) {
    _assert(teamId, _tcombForked2.default.Number, 'teamId');

    _assert(data, _tcombForked2.default.Object, 'data');

    const process = this.teamsToProcess.get(teamId);
    if (!process) {
      logger.warn('No team', { teamId });
      return;
    }
    process.sendMessage(teamId, data);
  }

  close() {
    this.processes.forEach(process => process.kill());
  }
}
exports.default = Pool;

function _assert(x, type, name) {
  if (false) {
    _tcombForked2.default.fail = function (message) {
      console.warn(message);
    };
  }

  if (_tcombForked2.default.isType(type) && type.meta.kind !== 'struct') {
    if (!type.is(x)) {
      type(x, [name + ': ' + _tcombForked2.default.getTypeName(type)]);
    }
  } else if (!(x instanceof type)) {
    _tcombForked2.default.fail('Invalid value ' + _tcombForked2.default.stringify(x) + ' supplied to ' + name + ' (expected a ' + _tcombForked2.default.getTypeName(type) + ')');
  }

  return x;
}
//# sourceMappingURL=index.js.map