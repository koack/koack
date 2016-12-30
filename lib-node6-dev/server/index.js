'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
// import bodyParser from 'koa-bodyparser';


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

const createTeam = installInfo => {
  _assert(installInfo, _index.InstallInfoType, 'installInfo');

  return _assert((() => {
    return _extends({}, installInfo.team, {
      bot: installInfo.bot,
      installations: [{ user: installInfo.user, date: installInfo.date, scopes: installInfo.scopes }]
    });
  })(), _index.TeamType, 'return value');
};

class SlackServer extends _koa2.default {
  constructor(config) {
    _assert(config, SlackServerConfigType, 'config');

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
    _assert(config, ListenConfigType, 'config');

    _assert(certificatesDirname, _tcombForked2.default.maybe(_tcombForked2.default.String), 'certificatesDirname');

    this.config = (0, _object2map2.default)(config);
    (0, _alpListen2.default)(certificatesDirname)(this);
  }
}
exports.default = SlackServer;

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