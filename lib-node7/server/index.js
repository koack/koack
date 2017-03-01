'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _koa = require('koa');

var _koa2 = _interopRequireDefault(_koa);

var _koaRoute = require('koa-route');

var _koaRoute2 = _interopRequireDefault(_koaRoute);

var _alpListen = require('alp-listen');

var _alpListen2 = _interopRequireDefault(_alpListen);

var _object2map = require('object2map');

var _object2map2 = _interopRequireDefault(_object2map);

var _slack = require('./slack');

var _slack2 = _interopRequireDefault(_slack);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let SlackServer = class extends _koa2.default {

  constructor({
    pool,
    storage,
    slackClient,
    scopes,
    callbackUrl = '/callback',
    redirectUrl = '/success'
  }) {
    super();
    this.pool = pool;
    this.storage = storage;
    // this.use(bodyParser());

    const slackActions = (0, _slack2.default)({
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
    this.use(_koaRoute2.default.get(url, callback));
  }

  registerPost(url, callback) {
    this.use(_koaRoute2.default.post(url, callback));
  }

  listen(config, certificatesDirname) {
    this.config = (0, _object2map2.default)(config);
    (0, _alpListen2.default)(certificatesDirname)(this);
    this.storage.forEach(team => this.pool.addTeam(team));
  }

  stop() {
    return this.pool.close();
  }
};
// import bodyParser from 'koa-bodyparser';

exports.default = SlackServer;
//# sourceMappingURL=index.js.map