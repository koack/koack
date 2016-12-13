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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

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

    Object.assign(options);
  }

  start(iterator) {
    return _asyncToGenerator(function* () {
      logger.info('bot server is starting');

      // eslint-disable-next-line no-restricted-syntax
      for (const item of iterator) {
        const team = yield item;
        yield (0, _startBot2.default)(team);
      }
    })();
  }

  sendBotMessage(teamId, data) {
    _assert(teamId, _tcombForked2.default.Number, 'teamId');

    _assert(data, _tcombForked2.default.Object, 'data');

    if (!this.teamsToProcess.has(teamId)) {
      logger.warn('No team', { teamId });
      return;
    }

    this.teamsToProcess.get(teamId).sendMessage(teamId, data);
  }

  close() {
    this.processes.forEach(process => process.kill());
  }
}
exports.default = Pool;

function _assert(x, type, name) {
  function message() {
    return 'Invalid value ' + _tcombForked2.default.stringify(x) + ' supplied to ' + name + ' (expected a ' + _tcombForked2.default.getTypeName(type) + ')';
  }

  if (_tcombForked2.default.isType(type)) {
    if (!type.is(x)) {
      type(x, [name + ': ' + _tcombForked2.default.getTypeName(type)]);

      _tcombForked2.default.fail(message());
    }
  } else if (!(x instanceof type)) {
    _tcombForked2.default.fail(message());
  }

  return x;
}
//# sourceMappingURL=index.js.map