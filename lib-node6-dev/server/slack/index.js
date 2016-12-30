'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _tcombForked = require('tcomb-forked');

var _tcombForked2 = _interopRequireDefault(_tcombForked);

var _simpleOauth = require('simple-oauth2');

var _index = require('../../types/index');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = function slack({
  client,
  scopes,
  callbackUrl = '/callback',
  redirectUrl = '/success',
  callback
}) {
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
        redirect_uri: `${ ctx.request.origin }${ callbackUrl }`,
        scope: scopes,
        state: '<state>'
      }));
    },

    callback: (() => {
      var _ref = _asyncToGenerator(function* (ctx) {
        const result = yield oauth2.clientCredentials.getToken({
          code: ctx.query.code,
          // eslint-disable-next-line camelcase
          redirect_uri: `${ ctx.request.origin }${ callbackUrl }`
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

        const installInfo = _assert({
          date: new Date(),
          scopes,
          team: { id: teamId, name: teamName },
          user: { id: userId, accessToken },
          bot: { id: botUserId, accessToken: botAccessToken }
        }, _index.InstallInfoType, 'installInfo');

        if (callback) yield callback(installInfo);

        ctx.redirect(redirectUrl);
      });

      return function callback(_x) {
        return _ref.apply(this, arguments);
      };
    })()
  };
};

function _assert(x, type, name) {
  function message() {
    return 'Invalid value ' + _tcombForked2.default.stringify(x) + ' supplied to ' + name + ' (expected a ' + _tcombForked2.default.getTypeName(type) + ')';
  }

  if (_tcombForked2.default.isType(type)) {
    if (!type.is(x)) {
      type(x, [name + ': ' + _tcombForked2.default.getTypeName(type)]);

      _tcombForked2.default.fail(message());
    }
  } else if (!(x instanceof type)) {
    _tcombForked2.default.fail(message());
  }

  return x;
}
//# sourceMappingURL=index.js.map