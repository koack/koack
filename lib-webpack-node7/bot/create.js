import { RtmClient, WebClient, MemoryDataStore } from '@slack/client';
import Bot from './Bot';


export default function createBot(teamOrAccessToken) {
  const team = typeof teamOrAccessToken === 'string' ? null : teamOrAccessToken;
  const accessToken = team ? team.bot.accessToken : teamOrAccessToken;

  const rtm = new RtmClient(accessToken, {
    logLevel: 'error',
    autoReconnect: true,
    autoMark: true,
    dataStore: new MemoryDataStore()
  });

  const webClient = new WebClient(accessToken);

  const installerUsersWebClients = new Map();
  if (team && team.installations) {
    team.installations.forEach(installation => installerUsersWebClients.set(installation.user.id, installation.user.accessToken));

    installerUsersWebClients.forEach((accessToken, id) => installerUsersWebClients.set(id, new WebClient(accessToken)));
  }

  const bot = new Bot({ team, rtm, webClient, installerUsersWebClients });
  return bot.start();
}
//# sourceMappingURL=create.js.map