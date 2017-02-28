'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _simpleOauth = require('simple-oauth2');

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

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

    callback: (() => {
      var _ref = _asyncToGenerator(function* (ctx) {
        const result = yield oauth2.clientCredentials.getToken({
          code: ctx.query.code,
          // eslint-disable-next-line camelcase
          redirect_uri: `${ctx.request.origin}${callbackUrl}`
        });

        if (!result || !result.ok) {
          ctx.body = 'Error';
        }

        console.log(result);
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

        if (callback) yield callback(installInfo);

        ctx.redirect(redirectUrl);
      });

      return function callback() {
        return _ref.apply(this, arguments);
      };
    })()
  };
};
//# sourceMappingURL=index.js.map