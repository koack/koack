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

var _pool = require('../../pool');

var _pool2 = _interopRequireDefault(_pool);

var _slack = require('./slack');

var _slack2 = _interopRequireDefault(_slack);

var _index = require('../types/index');

var _flowRuntime = require('flow-runtime');

var _flowRuntime2 = _interopRequireDefault(_flowRuntime);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }
// import bodyParser from 'koa-bodyparser';


const StorageType = _flowRuntime2.default.tdz(() => _index.StorageType);

const TeamType = _flowRuntime2.default.tdz(() => _index.TeamType);

const SlackClientConfigType = _flowRuntime2.default.type('SlackClientConfigType', _flowRuntime2.default.exactObject(_flowRuntime2.default.property('clientID', _flowRuntime2.default.string()), _flowRuntime2.default.property('clientSecret', _flowRuntime2.default.string())));

const SlackServerConfigType = _flowRuntime2.default.type('SlackServerConfigType', _flowRuntime2.default.exactObject(_flowRuntime2.default.property('slackClient', SlackClientConfigType), _flowRuntime2.default.property('pool', _flowRuntime2.default.ref(_pool2.default)), _flowRuntime2.default.property('storage', _flowRuntime2.default.ref(StorageType)), _flowRuntime2.default.property('scopes', _flowRuntime2.default.array(_flowRuntime2.default.string())), _flowRuntime2.default.property('callbackUrl', _flowRuntime2.default.nullable(_flowRuntime2.default.string())), _flowRuntime2.default.property('redirectUrl', _flowRuntime2.default.nullable(_flowRuntime2.default.string()))));

const ListenConfigType = _flowRuntime2.default.type('ListenConfigType', _flowRuntime2.default.exactObject(_flowRuntime2.default.property('tls', _flowRuntime2.default.nullable(_flowRuntime2.default.boolean())), _flowRuntime2.default.property('socketPath', _flowRuntime2.default.nullable(_flowRuntime2.default.string())), _flowRuntime2.default.property('port', _flowRuntime2.default.nullable(_flowRuntime2.default.number())), _flowRuntime2.default.property('hostname', _flowRuntime2.default.nullable(_flowRuntime2.default.string()))));

class SlackServer extends _koa2.default {

  constructor({
    pool,
    storage,
    slackClient,
    scopes,
    callbackUrl = '/callback',
    redirectUrl = '/success'
  }) {
    var _this;

    _flowRuntime2.default.param('arguments[0]', SlackServerConfigType).assert(arguments[0]);

    _this = super();
    this.pool = pool;
    this.storage = storage;
    // this.use(bodyParser());

    const slackActions = (0, _slack2.default)({
      client: slackClient,
      scopes,
      callbackUrl,
      redirectUrl,
      callback: (() => {
        var _ref = _asyncToGenerator(function* (installInfo) {
          const team = _flowRuntime2.default.ref(TeamType).assert((yield _this.storage.installedTeam(installInfo)));
          _this.pool.addTeam(team);
          _this.emit('installed', installInfo);
        });

        return function callback() {
          return _ref.apply(this, arguments);
        };
      })()
    });

    this.registerGet('/', slackActions.authorize);
    this.registerGet(callbackUrl, slackActions.callback);
  }

  registerGet(url, callback) {
    let _urlType = _flowRuntime2.default.string();

    let _callbackType = _flowRuntime2.default.function();

    _flowRuntime2.default.param('url', _urlType).assert(url);

    _flowRuntime2.default.param('callback', _callbackType).assert(callback);

    this.use(_koaRoute2.default.get(url, callback));
  }

  registerPost(url, callback) {
    let _urlType2 = _flowRuntime2.default.string();

    let _callbackType2 = _flowRuntime2.default.function();

    _flowRuntime2.default.param('url', _urlType2).assert(url);

    _flowRuntime2.default.param('callback', _callbackType2).assert(callback);

    this.use(_koaRoute2.default.post(url, callback));
  }

  listen(config, certificatesDirname) {
    let _certificatesDirnameType = _flowRuntime2.default.nullable(_flowRuntime2.default.string());

    _flowRuntime2.default.param('config', ListenConfigType).assert(config);

    _flowRuntime2.default.param('certificatesDirname', _certificatesDirnameType).assert(certificatesDirname);

    this.config = (0, _object2map2.default)(config);
    (0, _alpListen2.default)(certificatesDirname)(this);
    this.storage.forEach(team => {
      let _teamType = _flowRuntime2.default.ref(TeamType);

      _flowRuntime2.default.param('team', _teamType).assert(team);

      return this.pool.addTeam(team);
    });
  }

  stop() {
    return this.pool.close();
  }
}
exports.default = SlackServer;
//# sourceMappingURL=index.js.map