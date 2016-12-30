import { RtmClient, WebClient, MemoryDataStore } from '@slack/client';
import Bot from './Bot';
import type { TeamType } from '../types/';

export default function createBot(team: TeamType) {
  const rtm = new RtmClient(team.bot.accessToken, {
    logLevel: PRODUCTION ? 'error' : 'info',
    autoReconnect: true,
    autoMark: true,
    dataStore: new MemoryDataStore(),
  });

  const webClient = new WebClient(team.bot.accessToken);

  const installerUsersWebClients = new Map();
  if (team.installations) {
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
