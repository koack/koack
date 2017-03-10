

export const createInstallation = installInfo => ({
  user: installInfo.user,
  date: installInfo.date,
  scopes: installInfo.scopes
});


export const createTeam = installInfo => Object.assign({}, installInfo.team, {
  bot: installInfo.bot,
  installations: [createInstallation(installInfo)]
});

export const updateTeam = (team, installInfo) => Object.assign({}, team, installInfo.team, {
  bot: installInfo.bot,
  installations: [...team.installations, createInstallation(installInfo)]
});
//# sourceMappingURL=utils.js.map