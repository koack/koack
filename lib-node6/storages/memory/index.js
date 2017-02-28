'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _utils = require('../utils');

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = () => {
  const teams = new Map();

  return {
    forEach: callback => teams.forEach(callback),

    installedTeam: (() => {
      var _ref = _asyncToGenerator(function* (installInfo) {
        let team = teams.get(installInfo.team.id);

        if (!team) {
          team = (0, _utils.createTeam)(installInfo);
          teams.set(team.id, team);
        } else {
          team = (0, _utils.updateTeam)(team, installInfo);
          teams.set(team.id, team);
        }

        return team;
      });

      return function installedTeam() {
        return _ref.apply(this, arguments);
      };
    })()
  };
};
//# sourceMappingURL=index.js.map