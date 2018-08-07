export interface User {
  id: string;
  name?: string;
  accessToken: string;
}

export interface InstallationInfo {
  user: User;
  date: Date | string;
  scopes: Array<string>;
}

export type TeamId = string;

export interface Team {
  id: TeamId;
  name: string;
  bot: User;
  installations?: Array<InstallationInfo>;
}

export interface InstallInfo extends InstallationInfo {
  team: { id: string; name: string };
  bot: User;
}

export type WhereType = 'dm' | 'channel' | 'group';

type CallbackTeam = (team: Team) => void;

export interface Storage {
  forEach: (callback: CallbackTeam) => void;
  installedTeam: (installInfo: InstallInfo) => Promise<Team> | Team;
}
