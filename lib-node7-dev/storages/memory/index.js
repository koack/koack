'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _types = require('../../types');

var _utils = require('../utils');

var _flowRuntime = require('flow-runtime');

var _flowRuntime2 = _interopRequireDefault(_flowRuntime);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const InstallInfoType = _flowRuntime2.default.tdz(() => _types.InstallInfoType);

const StorageType = _flowRuntime2.default.tdz(() => _types.StorageType);

const TeamType = _flowRuntime2.default.tdz(() => _types.TeamType);

exports.default = function memory() {
  const _returnType2 = _flowRuntime2.default.return(_flowRuntime2.default.ref(StorageType));

  const teams = _flowRuntime2.default.ref('Map', _flowRuntime2.default.string(), _flowRuntime2.default.ref(TeamType)).assert(new Map());

  return _returnType2.assert({
    forEach: callback => teams.forEach(callback),

    installedTeam: async installInfo => {
      let _installInfoType = _flowRuntime2.default.ref(InstallInfoType);

      const _returnType = _flowRuntime2.default.return(_flowRuntime2.default.union(_flowRuntime2.default.ref(TeamType), _flowRuntime2.default.ref('Promise', _flowRuntime2.default.ref(TeamType))));

      _flowRuntime2.default.param('installInfo', _installInfoType).assert(installInfo);

      let _teamType = _flowRuntime2.default.nullable(_flowRuntime2.default.ref(TeamType)),
          team = _teamType.assert(teams.get(installInfo.team.id));

      if (!team) {
        team = _teamType.assert((0, _utils.createTeam)(installInfo));
        teams.set(team.id, team);
      } else {
        team = _teamType.assert((0, _utils.updateTeam)(team, installInfo));
        teams.set(team.id, team);
      }

      return _returnType.assert(team);
    }
  });
};
//# sourceMappingURL=index.js.map