/* @flow */
import type { InstallInfoType, TeamType } from '../types/index';

export const createInstallation = (installInfo: InstallInfoType) => ({
  user: installInfo.user,
  date: installInfo.date,
  scopes: installInfo.scopes,
});

export const createTeam = (installInfo: InstallInfoType): TeamType => ({
  ...installInfo.team,
  bot: installInfo.bot,
  installations: [createInstallation(installInfo)],
});


export const updateTeam = (team: TeamType, installInfo: InstallInfoType): TeamType => ({
  ...team,
  ...installInfo.team,
  bot: installInfo.bot,
  installations: [...team.installations, createInstallation(installInfo)],
});
