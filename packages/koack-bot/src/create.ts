import { RTMClient, WebClient } from '@slack/client';
import { Team } from 'koack-types';
import Bot from './Bot';

export type TeamOrToken = Team | string;

export default function createBot(teamOrAccessToken: TeamOrToken) {
  const team: Team | undefined =
    typeof teamOrAccessToken === 'string' ? undefined : teamOrAccessToken;
  const accessToken: string = team ? team.bot.accessToken : (teamOrAccessToken as string);

  const rtm = new RTMClient(accessToken, {
    // logger: (level, message) =>
    autoReconnect: true,
  });

  const webClient = new WebClient(accessToken);

  const installerUsersWebClients = new Map();
  if (team && team.installations) {
    team.installations.forEach(installation =>
      installerUsersWebClients.set(installation.user.id, installation.user.accessToken),
    );

    installerUsersWebClients.forEach((accessToken, id) =>
      installerUsersWebClients.set(id, new WebClient(accessToken)),
    );
  }

  const bot = new Bot({ team, rtm, webClient, installerUsersWebClients });
  return bot.start();
}
