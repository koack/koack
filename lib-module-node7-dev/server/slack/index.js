import { create } from 'simple-oauth2';
import { InstallInfoType as _InstallInfoType } from '../../types/index';

import t from 'flow-runtime';
const InstallInfoType = t.tdz(() => _InstallInfoType);
const ArgsType = t.type('ArgsType', t.exactObject(t.property('client', t.exactObject(t.property('clientID', t.string()), t.property('clientSecret', t.string()))), t.property('scopes', t.array(t.string())), t.property('callbackUrl', t.string()), t.property('redirectUrl', t.string()), t.property('callback', t.function(t.param('_arg0', t.ref(InstallInfoType)), t.return(t.union(t.void(), t.ref('Promise', t.void())))))));


export default (function slack(_arg) {
  let {
    client,
    scopes,
    callbackUrl = '/callback',
    redirectUrl = '/success',
    callback
  } = ArgsType.assert(_arg);

  const oauth2 = create({
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

      const installInfo = t.ref(InstallInfoType).assert({
        date: new Date(),
        scopes,
        team: { id: teamId, name: teamName },
        user: { id: userId, accessToken },
        bot: { id: botUserId, accessToken: botAccessToken }
      });

      if (callback) await callback(installInfo);

      ctx.redirect(redirectUrl);
    }
  };
});
//# sourceMappingURL=index.js.map