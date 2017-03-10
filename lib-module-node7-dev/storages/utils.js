import { InstallInfoType as _InstallInfoType, TeamType as _TeamType } from '../types/index';

import t from 'flow-runtime';
const InstallInfoType = t.tdz(() => _InstallInfoType);
const TeamType = t.tdz(() => _TeamType);
export const createInstallation = installInfo => {
  let _installInfoType = t.ref(InstallInfoType);

  t.param('installInfo', _installInfoType).assert(installInfo);
  return {
    user: installInfo.user,
    date: installInfo.date,
    scopes: installInfo.scopes
  };
};

export const createTeam = installInfo => {
  let _installInfoType2 = t.ref(InstallInfoType);

  const _returnType = t.return(t.ref(TeamType));

  t.param('installInfo', _installInfoType2).assert(installInfo);
  return _returnType.assert(Object.assign({}, installInfo.team, {
    bot: installInfo.bot,
    installations: [createInstallation(installInfo)]
  }));
};

export const updateTeam = (team, installInfo) => {
  let _teamType = t.ref(TeamType);

  let _installInfoType3 = t.ref(InstallInfoType);

  const _returnType2 = t.return(t.ref(TeamType));

  t.param('team', _teamType).assert(team);
  t.param('installInfo', _installInfoType3).assert(installInfo);
  return _returnType2.assert(Object.assign({}, team, installInfo.team, {
    bot: installInfo.bot,
    installations: [...team.installations, createInstallation(installInfo)]
  }));
};
//# sourceMappingURL=utils.js.map