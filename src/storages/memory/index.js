/* @flow */
import type { InstallInfoType, StorageType, TeamType } from '../../types';
import { createTeam, updateTeam } from '../utils';

export default (): StorageType => {
  const teams: Map<string, TeamType> = new Map();

  return {
    forEach: (callback) => teams.forEach(callback),

    installedTeam: async (installInfo: InstallInfoType): Promise<TeamType> => {
      let team: ?TeamType = teams.get(installInfo.team.id);

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
