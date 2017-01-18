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

const ArgsType = _tcombForked2.default.interface({
  client: _tcombForked2.default.interface({
    clientID: _tcombForked2.default.String,
    clientSecret: _tcombForked2.default.String
  }, {
    strict: true
  }),
  scopes: _tcombForked2.default.list(_tcombForked2.default.String),
  callbackUrl: _tcombForked2.default.String,
  redirectUrl: _tcombForked2.default.String,
  callback: _tcombForked2.default.Function
}, {
  name: 'ArgsType',
  strict: true
});

exports.default = function slack({
  client,
  scopes,
  callbackUrl = '/callback',
  redirectUrl = '/success',
  callback
}) {
  _assert({
    client,
    scopes,
    callbackUrl,
    redirectUrl,
    callback
  }, ArgsType, '{ client, scopes, callbackUrl = \'/callback\', redirectUrl = \'/success\', callback }');

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
  if (false) {
    _tcombForked2.default.fail = function (message) {
      console.warn(message);
    };
  }

  if (_tcombForked2.default.isType(type) && type.meta.kind !== 'struct') {
    if (!type.is(x)) {
      type(x, [name + ': ' + _tcombForked2.default.getTypeName(type)]);
    }
  } else if (!(x instanceof type)) {
    _tcombForked2.default.fail('Invalid value ' + _tcombForked2.default.stringify(x) + ' supplied to ' + name + ' (expected a ' + _tcombForked2.default.getTypeName(type) + ')');
  }

  return x;
}
//# sourceMappingURL=index.js.map