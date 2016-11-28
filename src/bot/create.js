import { RtmClient, WebClient, MemoryDataStore } from '@slack/client';
import Bot from './Bot';
import type { TeamType } from '../types/';

export default function createBot(team: TeamType) {
  const rtm = new RtmClient(team.token, {
    logLevel: PRODUCTION ? 'error' : 'info',
    autoReconnect: true,
    autoMark: true,
    dataStore: new MemoryDataStore(),
  });

  const webClient = new WebClient(team.token);

  const installerUsersWebClients = !team.installerUsers ? null : new Map(
    team.installerUsers.map(user => [user.slackId, new WebClient(user.token)]),
  );

  rtm.start();

  return new Bot({ rtm, webClient, installerUsersWebClients });
}
