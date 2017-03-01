'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _dec, _dec2, _desc, _value, _class, _descriptor, _descriptor2;
// import bodyParser from 'koa-bodyparser';


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

function _initDefineProp(target, property, descriptor, context) {
  if (!descriptor) return;
  Object.defineProperty(target, property, {
    enumerable: descriptor.enumerable,
    configurable: descriptor.configurable,
    writable: descriptor.writable,
    value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
  });
}

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
  var desc = {};
  Object['keys'](descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;

  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }

  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);

  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }

  if (desc.initializer === void 0) {
    Object['defineProperty'](target, property, desc);
    desc = null;
  }

  return desc;
}

function _initializerWarningHelper() {
  throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
}

const StorageType = _flowRuntime2.default.tdz(() => _index.StorageType);

const TeamType = _flowRuntime2.default.tdz(() => _index.TeamType);

const SlackClientConfigType = _flowRuntime2.default.type('SlackClientConfigType', _flowRuntime2.default.exactObject(_flowRuntime2.default.property('clientID', _flowRuntime2.default.string()), _flowRuntime2.default.property('clientSecret', _flowRuntime2.default.string())));

const SlackServerConfigType = _flowRuntime2.default.type('SlackServerConfigType', _flowRuntime2.default.exactObject(_flowRuntime2.default.property('slackClient', SlackClientConfigType), _flowRuntime2.default.property('pool', _flowRuntime2.default.ref(_pool2.default)), _flowRuntime2.default.property('storage', _flowRuntime2.default.ref(StorageType)), _flowRuntime2.default.property('scopes', _flowRuntime2.default.array(_flowRuntime2.default.string())), _flowRuntime2.default.property('callbackUrl', _flowRuntime2.default.nullable(_flowRuntime2.default.string())), _flowRuntime2.default.property('redirectUrl', _flowRuntime2.default.nullable(_flowRuntime2.default.string()))));

const ListenConfigType = _flowRuntime2.default.type('ListenConfigType', _flowRuntime2.default.exactObject(_flowRuntime2.default.property('tls', _flowRuntime2.default.nullable(_flowRuntime2.default.boolean())), _flowRuntime2.default.property('socketPath', _flowRuntime2.default.nullable(_flowRuntime2.default.string())), _flowRuntime2.default.property('port', _flowRuntime2.default.nullable(_flowRuntime2.default.number())), _flowRuntime2.default.property('hostname', _flowRuntime2.default.nullable(_flowRuntime2.default.string()))));

let SlackServer = (_dec = _flowRuntime2.default.decorate(function () {
  return _flowRuntime2.default.ref(_pool2.default);
}), _dec2 = _flowRuntime2.default.decorate(_flowRuntime2.default.ref(StorageType)), (_class = class extends _koa2.default {

  constructor({
    pool,
    storage,
    slackClient,
    scopes,
    callbackUrl = '/callback',
    redirectUrl = '/success'
  }) {
    _flowRuntime2.default.param('arguments[0]', SlackServerConfigType).assert(arguments[0]);

    super();

    _initDefineProp(this, 'pool', _descriptor, this);

    _initDefineProp(this, 'storage', _descriptor2, this);

    this.pool = pool;
    this.storage = storage;
    // this.use(bodyParser());

    const slackActions = (0, _slack2.default)({
      client: slackClient,
      scopes,
      callbackUrl,
      redirectUrl,
      callback: async installInfo => {
        const team = _flowRuntime2.default.ref(TeamType).assert((await this.storage.installedTeam(installInfo)));
        this.pool.addTeam(team);
        this.emit('installed', installInfo);
      }
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
}, (_descriptor = _applyDecoratedDescriptor(_class.prototype, 'pool', [_dec], {
  enumerable: true,
  initializer: null
}), _descriptor2 = _applyDecoratedDescriptor(_class.prototype, 'storage', [_dec2], {
  enumerable: true,
  initializer: null
})), _class));
exports.default = SlackServer;
//# sourceMappingURL=index.js.map