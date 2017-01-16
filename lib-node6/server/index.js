'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }
// import bodyParser from 'koa-bodyparser';


class SlackServer extends _koa2.default {

  constructor(config) {
    var _this;

    _this = super();
    Object.assign(this, config);
    // this.use(bodyParser());

    const slackActions = (0, _slack2.default)({
      client: config.slackClient,
      scopes: config.scopes,
      callbackUrl: '/callback',
      successUrl: '/success',
      callback: (() => {
        var _ref = _asyncToGenerator(function* (installInfo) {
          const team = yield _this.storage.installedTeam(installInfo);
          _this.pool.addTeam(team);
          _this.emit('installed', installInfo);
        });

        return function callback(_x) {
          return _ref.apply(this, arguments);
        };
      })()
    });

    this.use(_koaRoute2.default.get('/', slackActions.authorize));
    this.use(_koaRoute2.default.get('/callback', slackActions.callback));
    this.use(_koaRoute2.default.get('/success', ctx => ctx.body = 'Youhou !!!'));
  }

  listen(config, certificatesDirname) {
    this.config = (0, _object2map2.default)(config);
    (0, _alpListen2.default)(certificatesDirname)(this);
    this.storage.forEach(team => this.pool.addTeam(team));
  }
}
exports.default = SlackServer;
//# sourceMappingURL=index.js.map