import { InstallInfoType as _InstallInfoType, StorageType as _StorageType, TeamType as _TeamType } from '../../types';
import { createTeam, updateTeam } from '../utils';

import t from 'flow-runtime';
const InstallInfoType = t.tdz(() => _InstallInfoType);
const StorageType = t.tdz(() => _StorageType);
const TeamType = t.tdz(() => _TeamType);
export default (function memory() {
  const _returnType2 = t.return(t.ref(StorageType));

  const teams = t.ref('Map', t.string(), t.ref(TeamType)).assert(new Map());

  return _returnType2.assert({
    forEach: callback => teams.forEach(callback),

    installedTeam: async installInfo => {
      let _installInfoType = t.ref(InstallInfoType);

      const _returnType = t.return(t.union(t.ref(TeamType), t.ref('Promise', t.ref(TeamType))));

      t.param('installInfo', _installInfoType).assert(installInfo);

      let _teamType = t.nullable(t.ref(TeamType)),
          team = _teamType.assert(teams.get(installInfo.team.id));

      if (!team) {
        team = _teamType.assert(createTeam(installInfo));
        teams.set(team.id, team);
      } else {
        team = _teamType.assert(updateTeam(team, installInfo));
        teams.set(team.id, team);
      }

      return _returnType.assert(team);
    }
  });
});
//# sourceMappingURL=index.js.map