
import { InstallInfo, Team } from 'koack-types';

export const createInstallation = (installInfo: InstallInfo) => ({
  user: installInfo.user,
  date: installInfo.date,
  scopes: installInfo.scopes,
});

export const createTeam = (installInfo: InstallInfo): Team => ({
  ...installInfo.team,
  bot: installInfo.bot,
  installations: [createInstallation(installInfo)],
});


export const updateTeam = (team: Team, installInfo: InstallInfo): Team => ({
  ...team,
  ...installInfo.team,
  bot: installInfo.bot,
  installations: [...team.installations, createInstallation(installInfo)],
});
