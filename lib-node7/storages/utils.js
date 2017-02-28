'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
const createInstallation = exports.createInstallation = installInfo => ({
  user: installInfo.user,
  date: installInfo.date,
  scopes: installInfo.scopes
});
const createTeam = exports.createTeam = installInfo => Object.assign({}, installInfo.team, {
  bot: installInfo.bot,
  installations: [createInstallation(installInfo)]
});

const updateTeam = exports.updateTeam = (team, installInfo) => Object.assign({}, team, installInfo.team, {
  bot: installInfo.bot,
  installations: [...team.installations, createInstallation(installInfo)]
});
//# sourceMappingURL=utils.js.map