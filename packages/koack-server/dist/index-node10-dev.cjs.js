'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var simpleOauth2 = require('simple-oauth2');
var Koa = _interopDefault(require('koa'));
var route = _interopDefault(require('koa-route'));
var alplisten = _interopDefault(require('alp-listen'));

var createSlackActions = (({
  client,
  scopes,
  callbackUrl = '/callback',
  redirectUrl = '/success',
  callback
}) => {
  const oauth2 = simpleOauth2.create({
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
        scope: scopes.join(' '),
        state: '<state>'
      }));
    },
    callback: async ctx => {
      const result = await oauth2.authorizationCode.getToken({
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
        team: {
          id: teamId,
          name: teamName
        },
        user: {
          id: userId,
          accessToken
        },
        bot: {
          id: botUserId,
          accessToken: botAccessToken
        }
      };
      if (callback) await callback(installInfo);
      ctx.redirect(redirectUrl);
    }
  };
});

class SlackServer extends Koa {
  constructor({
    pool,
    storage,
    slackClient,
    scopes,
    callbackUrl = '/callback',
    redirectUrl = '/success'
  }) {
    super();
    this.pool = void 0;
    this.storage = void 0;
    this.pool = pool;
    this.storage = storage; // this.use(bodyParser());

    const slackActions = createSlackActions({
      client: slackClient,
      scopes,
      callbackUrl,
      redirectUrl,
      callback: async installInfo => {
        const team = await this.storage.installedTeam(installInfo);
        this.pool.addTeam(team);
        this.emit('installed', installInfo);
      }
    });
    this.registerGet('/', slackActions.authorize);
    this.registerGet(callbackUrl, slackActions.callback);
  }

  registerGet(url, callback) {
    this.use(route.get(url, callback));
  }

  registerPost(url, callback) {
    this.use(route.post(url, callback));
  }

  listen(config, certificatesDirname) {
    this.config = new Map(Object.keys(config).map(key => [key, config[key]]));
    alplisten(certificatesDirname)(this);
    this.storage.forEach(team => this.pool.addTeam(team));
  }

  stop() {
    return this.pool.close();
  }

}

exports.default = SlackServer;
//# sourceMappingURL=index-node10-dev.cjs.js.map
