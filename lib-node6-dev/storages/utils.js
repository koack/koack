'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateTeam = exports.createTeam = exports.createInstallation = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _tcombForked = require('tcomb-forked');

var _tcombForked2 = _interopRequireDefault(_tcombForked);

var _index = require('../types/index');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const createInstallation = exports.createInstallation = installInfo => {
  _assert(installInfo, _index.InstallInfoType, 'installInfo');

  return {
    user: installInfo.user,
    date: installInfo.date,
    scopes: installInfo.scopes
  };
};

const createTeam = exports.createTeam = installInfo => {
  _assert(installInfo, _index.InstallInfoType, 'installInfo');

  return _assert((() => {
    return _extends({}, installInfo.team, {
      bot: installInfo.bot,
      installations: [createInstallation(installInfo)]
    });
  })(), _index.TeamType, 'return value');
};

const updateTeam = exports.updateTeam = (team, installInfo) => {
  _assert(team, _index.TeamType, 'team');

  _assert(installInfo, _index.InstallInfoType, 'installInfo');

  return _assert((() => {
    return _extends({}, team, installInfo.team, {
      bot: installInfo.bot,
      installations: [...team.installations, createInstallation(installInfo)]
    });
  })(), _index.TeamType, 'return value');
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
//# sourceMappingURL=utils.js.map