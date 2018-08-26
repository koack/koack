import { create } from 'simple-oauth2';
import { InstallInfo } from 'koack-types';
import { Context } from 'koa';

interface ClientConfig {
  clientID: string;
  clientSecret: string;
}
interface ArgsType {
  client: ClientConfig;
  scopes: Array<string>;
  callbackUrl: string;
  redirectUrl: string;
  callback: (info: InstallInfo) => void | Promise<void>;
}

export default ({
  client,
  scopes,
  callbackUrl = '/callback',
  redirectUrl = '/success',
  callback,
}: ArgsType) => {
  const oauth2 = create({
    client: {
      id: client.clientID,
      secret: client.clientSecret,
    },
    auth: {
      tokenHost: 'https://slack.com',
      tokenPath: '/api/oauth.access',
      authorizePath: '/oauth/authorize',
    },
  });

  return {
    authorize: (ctx: Context) => {
      ctx.redirect(
        oauth2.authorizationCode.authorizeURL({
          // eslint-disable-next-line camelcase
          redirect_uri: `${ctx.request.origin}${callbackUrl}`,
          scope: scopes.join(' '),
          state: '<state>',
        }),
      );
    },

    callback: async (ctx: Context) => {
      const result = await oauth2.authorizationCode.getToken({
        code: ctx.query.code,
        // eslint-disable-next-line camelcase
        redirect_uri: `${ctx.request.origin}${callbackUrl}`,
      });

      if (!result || !result.ok) {
        ctx.body = 'Error';
      }

      const {
        team_id: teamId,
        team_name: teamName,
        user_id: userId,
        access_token: accessToken,
        bot: { bot_user_id: botUserId, bot_access_token: botAccessToken },
      } = result;

      const installInfo: InstallInfo = {
        date: new Date(),
        scopes,
        team: { id: teamId, name: teamName },
        user: { id: userId, accessToken },
        bot: { id: botUserId, accessToken: botAccessToken },
      };

      if (callback) await callback(installInfo);

      ctx.redirect(redirectUrl);
    },
  };
};
