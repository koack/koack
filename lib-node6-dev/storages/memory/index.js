'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _arguments = arguments;

var _tcombForked = require('tcomb-forked');

var _tcombForked2 = _interopRequireDefault(_tcombForked);

var _types = require('../../types');

var _utils = require('../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = function memory() {
  return _assert(function () {
    const teams = _assert(new Map(), Map, 'teams');

    return {
      forEach: callback => teams.forEach(callback),

      installedTeam: installInfo => {
        _assert(installInfo, _types.InstallInfoType, 'installInfo');

        return _assert((() => {
          var _ref = _asyncToGenerator(function* () {
            let team = _assert(teams.get(installInfo.team.id), _tcombForked2.default.maybe(_types.TeamType), 'team');

            if (!team) {
              team = _assert((0, _utils.createTeam)(installInfo), _tcombForked2.default.maybe(_types.TeamType), 'team');
              teams.set(team.id, team);
            } else {
              team = _assert((0, _utils.updateTeam)(team, installInfo), _tcombForked2.default.maybe(_types.TeamType), 'team');
              teams.set(team.id, team);
            }

            return team;
          });

          return function NAME() {
            return _ref.apply(this, arguments);
          };
        })()(), _tcombForked2.default.Promise, 'return value');
      }
    };
  }.apply(undefined, _arguments), _types.StorageType, 'return value');
};

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