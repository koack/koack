'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _utils = require('../utils');

exports.default = () => {
  const teams = new Map();

  return {
    forEach: callback => teams.forEach(callback),

    installedTeam: async installInfo => {
      let team = teams.get(installInfo.team.id);

      if (!team) {
        team = (0, _utils.createTeam)(installInfo);
        teams.set(team.id, team);
      } else {
        team = (0, _utils.updateTeam)(team, installInfo);
        teams.set(team.id, team);
      }

      return team;
    }
  };
};
//# sourceMappingURL=index.js.map