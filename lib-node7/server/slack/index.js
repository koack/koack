'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _simpleOauth = require('simple-oauth2');

exports.default = ({
  client,
  scopes,
  callbackUrl = '/callback',
  redirectUrl = '/success',
  callback
}) => {
  const oauth2 = (0, _simpleOauth.create)({
    client: {
      id: client.clientID,
      secret: client.clientSecret
    },
    auth: {
      tokenHost: 'https://slack.com',
      tokenPath: '/api/oauth.access',
      authorizePath: '/oauth/authorize'
    }
  });

  return {
    authorize: ctx => {
      ctx.redirect(oauth2.authorizationCode.authorizeURL({
        // eslint-disable-next-line camelcase
        redirect_uri: `${ctx.request.origin}${callbackUrl}`,
        scope: scopes,
        state: '<state>'
      }));
    },

    callback: async ctx => {
      const result = await oauth2.clientCredentials.getToken({
        code: ctx.query.code,
        // eslint-disable-next-line camelcase
        redirect_uri: `${ctx.request.origin}${callbackUrl}`
      });

      if (!result || !result.ok) {
        ctx.body = 'Error';
      }

      const {
        team_id: teamId,
        team_name: teamName,
        user_id: userId,
        access_token: accessToken,
        bot: {
          bot_user_id: botUserId,
          bot_access_token: botAccessToken
        }
      } = result;

      const installInfo = {
        date: new Date(),
        scopes,
        team: { id: teamId, name: teamName },
        user: { id: userId, accessToken },
        bot: { id: botUserId, accessToken: botAccessToken }
      };

      if (callback) await callback(installInfo);

      ctx.redirect(redirectUrl);
    }
  };
};
//# sourceMappingURL=index.js.map