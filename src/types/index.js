/* @flow */
export type UserType = {
  id: string,
  name: ?string,
  accessToken: string,
};

export type InstallationInfoType = {
  user: UserType,
  date: Date|string,
  scopes: Array<string>,
};

export type TeamType = {
  id: string,
  name: string,
  bot: UserType,
  installations: ?Array<InstallationInfoType>,
};

export type InstallInfoType = InstallationInfoType & {
  team: { id: string, name: string },
  bot: UserType,
}

export type WhereType = 'dm' | 'channel' | 'group';

type CallbackTeamType = (team: TeamType) => void;

export type StorageType = {
  forEach: (callback: CallbackTeamType) => void,
  installedTeam: (installInfo: InstallInfoType) => Promise<TeamType>|TeamType,
};
