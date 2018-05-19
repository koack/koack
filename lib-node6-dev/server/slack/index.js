'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _simpleOauth = require('simple-oauth2');

var _index = require('../../types/index');

var _flowRuntime = require('flow-runtime');

var _flowRuntime2 = _interopRequireDefault(_flowRuntime);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const InstallInfoType = _flowRuntime2.default.tdz(() => _index.InstallInfoType);

const ArgsType = _flowRuntime2.default.type('ArgsType', _flowRuntime2.default.exactObject(_flowRuntime2.default.property('client', _flowRuntime2.default.exactObject(_flowRuntime2.default.property('clientID', _flowRuntime2.default.string()), _flowRuntime2.default.property('clientSecret', _flowRuntime2.default.string()))), _flowRuntime2.default.property('scopes', _flowRuntime2.default.array(_flowRuntime2.default.string())), _flowRuntime2.default.property('callbackUrl', _flowRuntime2.default.string()), _flowRuntime2.default.property('redirectUrl', _flowRuntime2.default.string()), _flowRuntime2.default.property('callback', _flowRuntime2.default.function(_flowRuntime2.default.param('_arg0', _flowRuntime2.default.ref(InstallInfoType)), _flowRuntime2.default.return(_flowRuntime2.default.union(_flowRuntime2.default.void(), _flowRuntime2.default.ref('Promise', _flowRuntime2.default.void())))))));

exports.default = function slack(_arg) {
  let {
    client,
    scopes,
    callbackUrl = '/callback',
    redirectUrl = '/success',
    callback
  } = ArgsType.assert(_arg);

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

        const installInfo = _flowRuntime2.default.ref(InstallInfoType).assert({
          date: new Date(),
          scopes,
          team: { id: teamId, name: teamName },
          user: { id: userId, accessToken },
          bot: { id: botUserId, accessToken: botAccessToken }
        });

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