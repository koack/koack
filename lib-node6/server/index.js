'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
// import bodyParser from 'koa-bodyparser';


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

const createTeam = installInfo => _extends({}, installInfo.team, {
  bot: installInfo.bot,
  installations: [{ user: installInfo.user, date: installInfo.date, scopes: installInfo.scopes }]
});

class SlackServer extends _koa2.default {
  constructor(config) {
    super();
    Object.assign(this, config);
    // this.use(bodyParser());

    const slackActions = (0, _slack2.default)({
      client: config.slackClient,
      scopes: config.scopes,
      callbackUrl: '/callback',
      successUrl: '/success',
      callback: installInfo => {
        this.pool.addTeam(createTeam(installInfo));
        this.installSuccess(installInfo);
      }
    });

    this.use(_koaRoute2.default.get('/', slackActions.authorize));
    this.use(_koaRoute2.default.get('/callback', slackActions.callback));
    this.use(_koaRoute2.default.get('/success', ctx => ctx.body = 'Youhou !!!'));
  }

  installSuccess() {}

  listen(config, certificatesDirname) {
    this.config = (0, _object2map2.default)(config);
    (0, _alpListen2.default)(certificatesDirname)(this);
  }
}
exports.default = SlackServer;
//# sourceMappingURL=index.js.map