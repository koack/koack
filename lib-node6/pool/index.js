'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _nightingale = require('nightingale');

var _nightingale2 = _interopRequireDefault(_nightingale);

var _startBot = require('./startBot');

var _startBot2 = _interopRequireDefault(_startBot);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const logger = new _nightingale2.default('koack:pool');

class Pool {

  constructor(options) {
    this.processNextId = 1;
    this.processes = new Set();
    this.teamsToProcess = new Map();

    Object.assign(this, options);
  }

  start(iterator) {
    var _this = this;

    return _asyncToGenerator(function* () {
      logger.info('bot server is starting');

      // eslint-disable-next-line no-restricted-syntax
      for (const item of iterator) {
        const installInfo = yield item;
        yield (0, _startBot2.default)(_this, installInfo);
      }
    })();
  }

  addTeam(team) {
    (0, _startBot2.default)(this, team);
  }

  sendBotMessage(teamId, data) {
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
//# sourceMappingURL=index.js.map