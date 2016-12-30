import { RtmClient, WebClient, MemoryDataStore } from '@slack/client';
import Bot from './Bot';
import type { TeamType } from '../types/';

type TeamOrTokenType = TeamType | string;

export default function createBot(teamOrAccessToken: TeamOrTokenType) {
  const team = typeof teamOrAccessToken === 'string' ? null : teamOrAccessToken;
  const accessToken = team ? team.bot.accessToken : teamOrAccessToken;

  const rtm = new RtmClient(accessToken, {
    logLevel: PRODUCTION ? 'error' : 'info',
    autoReconnect: true,
    autoMark: true,
    dataStore: new MemoryDataStore(),
  });

  const webClient = new WebClient(accessToken);

  const installerUsersWebClients = new Map();
  if (team && team.installations) {
    team.installations.forEach(installation => (
      installerUsersWebClients.set(installation.user.id, installation.user.accessToken)
    ));

    installerUsersWebClients.forEach((accessToken, id) => (
      installerUsersWebClients.set(id, new WebClient(accessToken))
    ));
  }

  rtm.start();

  return new Bot({ team, rtm, webClient, installerUsersWebClients });
}
