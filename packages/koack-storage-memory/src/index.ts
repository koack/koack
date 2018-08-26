
import { Storage, InstallInfo, Team } from 'koack-types';
import { createTeam, updateTeam } from 'koack-storage-utils';

export default (): Storage => {
  const teams: Map<string, Team> = new Map();

  return {
    forEach: (callback) => teams.forEach(callback),

    installedTeam: async (installInfo: InstallInfo): Promise<Team> => {
      let team: ?Team = teams.get(installInfo.team.id);

      if (!team) {
        team = createTeam(installInfo);
        teams.set(team.id, team);
      } else {
        team = updateTeam(team, installInfo);
        teams.set(team.id, team);
      }

      return team;
    },
  };
};
