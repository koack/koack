import { RtmClient, WebClient, MemoryDataStore } from '@slack/client';
import Bot from './Bot';
import { TeamType as _TeamType } from '../types/';

import t from 'flow-runtime';
const TeamType = t.tdz(() => _TeamType);
const TeamOrTokenType = t.type('TeamOrTokenType', t.union(t.ref(TeamType), t.string()));


export default function createBot(teamOrAccessToken) {
  t.param('teamOrAccessToken', TeamOrTokenType).assert(teamOrAccessToken);

  const team = typeof teamOrAccessToken === 'string' ? null : teamOrAccessToken;
  const accessToken = team ? team.bot.accessToken : teamOrAccessToken;

  const rtm = new RtmClient(accessToken, {
    logLevel: 'info',
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