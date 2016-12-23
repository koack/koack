export type UserType = {
  slackId: string,
  token: string,
};

export type TeamType = {
  id: ?any,
  name: ?string,
  token: string,
  installerUsers: ?Array<UserType>,
};

export type WhereType = 'dm' | 'channel' | 'group';
