'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _tcombForked = require('tcomb-forked');

var _tcombForked2 = _interopRequireDefault(_tcombForked);

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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }
// import bodyParser from 'koa-bodyparser';


const SlackClientConfigType = _tcombForked2.default.interface({
  clientID: _tcombForked2.default.String,
  clientSecret: _tcombForked2.default.String
}, {
  name: 'SlackClientConfigType',
  strict: true
});

const SlackServerConfigType = _tcombForked2.default.interface({
  slackClient: SlackClientConfigType,
  pool: _pool2.default,
  storage: _index.StorageType,
  scopes: _tcombForked2.default.list(_tcombForked2.default.String)
}, {
  name: 'SlackServerConfigType',
  strict: true
});

const ListenConfigType = _tcombForked2.default.interface({
  tls: _tcombForked2.default.maybe(_tcombForked2.default.Boolean),
  socketPath: _tcombForked2.default.maybe(_tcombForked2.default.String),
  port: _tcombForked2.default.maybe(_tcombForked2.default.Number),
  hostname: _tcombForked2.default.maybe(_tcombForked2.default.String)
}, {
  name: 'ListenConfigType',
  strict: true
});

class SlackServer extends _koa2.default {

  constructor(config) {
    var _this;

    _assert(config, SlackServerConfigType, 'config');

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
          const team = _assert((yield _this.storage.installedTeam(installInfo)), _index.TeamType, 'team');
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
    _assert(config, ListenConfigType, 'config');

    _assert(certificatesDirname, _tcombForked2.default.maybe(_tcombForked2.default.String), 'certificatesDirname');

    this.config = (0, _object2map2.default)(config);
    (0, _alpListen2.default)(certificatesDirname)(this);
    this.storage.forEach(team => {
      _assert(team, _index.TeamType, 'team');

      return this.pool.addTeam(team);
    });
  }
}
exports.default = SlackServer;

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