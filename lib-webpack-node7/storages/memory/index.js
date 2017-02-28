
import { createTeam, updateTeam } from '../utils';


export default (() => {
  const teams = new Map();

  return {
    forEach: callback => teams.forEach(callback),

    installedTeam: async installInfo => {
      let team = teams.get(installInfo.team.id);

      if (!team) {
        team = createTeam(installInfo);
        teams.set(team.id, team);
      } else {
        team = updateTeam(team, installInfo);
        teams.set(team.id, team);
      }

      return team;
    }
  };
});
//# sourceMappingURL=index.js.map