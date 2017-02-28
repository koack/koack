'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateTeam = exports.createTeam = exports.createInstallation = undefined;

var _index = require('../types/index');

var _flowRuntime = require('flow-runtime');

var _flowRuntime2 = _interopRequireDefault(_flowRuntime);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const InstallInfoType = _flowRuntime2.default.tdz(() => _index.InstallInfoType);

const TeamType = _flowRuntime2.default.tdz(() => _index.TeamType);

const createInstallation = exports.createInstallation = installInfo => {
  let _installInfoType = _flowRuntime2.default.ref(InstallInfoType);

  _flowRuntime2.default.param('installInfo', _installInfoType).assert(installInfo);

  return {
    user: installInfo.user,
    date: installInfo.date,
    scopes: installInfo.scopes
  };
};

const createTeam = exports.createTeam = installInfo => {
  let _installInfoType2 = _flowRuntime2.default.ref(InstallInfoType);

  const _returnType = _flowRuntime2.default.return(_flowRuntime2.default.ref(TeamType));

  _flowRuntime2.default.param('installInfo', _installInfoType2).assert(installInfo);

  return _returnType.assert(Object.assign({}, installInfo.team, {
    bot: installInfo.bot,
    installations: [createInstallation(installInfo)]
  }));
};

const updateTeam = exports.updateTeam = (team, installInfo) => {
  let _teamType = _flowRuntime2.default.ref(TeamType);

  let _installInfoType3 = _flowRuntime2.default.ref(InstallInfoType);

  const _returnType2 = _flowRuntime2.default.return(_flowRuntime2.default.ref(TeamType));

  _flowRuntime2.default.param('team', _teamType).assert(team);

  _flowRuntime2.default.param('installInfo', _installInfoType3).assert(installInfo);

  return _returnType2.assert(Object.assign({}, team, installInfo.team, {
    bot: installInfo.bot,
    installations: [...team.installations, createInstallation(installInfo)]
  }));
};
//# sourceMappingURL=utils.js.map