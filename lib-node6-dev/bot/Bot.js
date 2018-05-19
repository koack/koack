'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _desc, _value, _class, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7;

var _client = require('@slack/client');

var _nightingaleLogger = require('nightingale-logger');

var _nightingaleLogger2 = _interopRequireDefault(_nightingaleLogger);

var _koaCompose = require('koa-compose');

var _koaCompose2 = _interopRequireDefault(_koaCompose);

var _events = require('events');

var _createContextFromBot = require('./context/createContextFromBot');

var _createContextFromBot2 = _interopRequireDefault(_createContextFromBot);

var _createContextFromEvent = require('./context/createContextFromEvent');

var _createContextFromEvent2 = _interopRequireDefault(_createContextFromEvent);

var _createContextFromInteractiveMessageResponse = require('./context/createContextFromInteractiveMessageResponse');

var _createContextFromInteractiveMessageResponse2 = _interopRequireDefault(_createContextFromInteractiveMessageResponse);

var _types = require('./types');

var _types2 = require('../types');

var _index = require('../index');

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

const TeamType = _flowRuntime2.default.tdz(() => _types2.TeamType);

const MiddlewareType = _flowRuntime2.default.tdz(() => _types.MiddlewareType);

const BotConstructorArguments = _flowRuntime2.default.type('BotConstructorArguments', _flowRuntime2.default.exactObject(_flowRuntime2.default.property('team', _flowRuntime2.default.nullable(_flowRuntime2.default.ref(TeamType))), _flowRuntime2.default.property('rtm', _flowRuntime2.default.ref(_client.RtmClient)), _flowRuntime2.default.property('webClient', _flowRuntime2.default.ref(_client.WebClient)), _flowRuntime2.default.property('installerUsersWebClients', _flowRuntime2.default.union(_flowRuntime2.default.null(), _flowRuntime2.default.ref('Map', _flowRuntime2.default.string(), _flowRuntime2.default.ref(_client.WebClient))))));

const logger = new _nightingaleLogger2.default('koack:bot');

let Bot = (_dec = _flowRuntime2.default.decorate(_flowRuntime2.default.nullable(_flowRuntime2.default.ref(TeamType))), _dec2 = _flowRuntime2.default.decorate(function () {
  return _flowRuntime2.default.ref(_client.RtmClient);
}), _dec3 = _flowRuntime2.default.decorate(function () {
  return _flowRuntime2.default.ref(_client.WebClient);
}), _dec4 = _flowRuntime2.default.decorate(function () {
  return _flowRuntime2.default.union(_flowRuntime2.default.null(), _flowRuntime2.default.ref('Map', _flowRuntime2.default.string(), _flowRuntime2.default.ref(_client.WebClient)));
}), _dec5 = _flowRuntime2.default.decorate(_flowRuntime2.default.array(_flowRuntime2.default.ref(MiddlewareType))), _dec6 = _flowRuntime2.default.decorate(_flowRuntime2.default.nullable(_flowRuntime2.default.string())), _dec7 = _flowRuntime2.default.decorate(_flowRuntime2.default.nullable(_flowRuntime2.default.string())), (_class = class {
  /** bot name in the team */
  constructor(data) {
    _initDefineProp(this, 'team', _descriptor, this);

    _initDefineProp(this, 'rtm', _descriptor2, this);

    _initDefineProp(this, 'webClient', _descriptor3, this);

    _initDefineProp(this, 'installerUsersWebClients', _descriptor4, this);

    _initDefineProp(this, 'middlewares', _descriptor5, this);

    _initDefineProp(this, 'id', _descriptor6, this);

    _initDefineProp(this, 'name', _descriptor7, this);

    this.internalEventEmitter = new _events.EventEmitter();

    _flowRuntime2.default.param('data', BotConstructorArguments).assert(data);

    Object.assign(this, data);
    this._ctx = (0, _createContextFromBot2.default)(this);
  }
  /** bot id in the team */


  use(middleware) {
    let _middlewareType = _flowRuntime2.default.ref(MiddlewareType);

    _flowRuntime2.default.param('middleware', _middlewareType).assert(middleware);

    logger.debug('use middleware', { name: middleware.name });
    this.middlewares.push(middleware);
  }

  on(name, ...middlewares) {
    let _nameType = _flowRuntime2.default.union(_flowRuntime2.default.string(), _flowRuntime2.default.any());

    let _middlewaresType = _flowRuntime2.default.array(_flowRuntime2.default.ref(MiddlewareType));

    _flowRuntime2.default.param('name', _nameType).assert(name);

    _flowRuntime2.default.rest('middlewares', _middlewaresType).assert(middlewares);

    const allMiddlewares = [...this.middlewares, ...middlewares];
    logger.debug('register middlewares on event', { name, middlewareLength: allMiddlewares.length });
    const callback = (0, _koaCompose2.default)(allMiddlewares);

    if (typeof name === 'symbol') {
      this.internalEventEmitter.on(name.toString(), callback);
      return;
    }

    this.rtm.on(name, event => {
      let _eventType = _flowRuntime2.default.object();

      _flowRuntime2.default.param('event', _eventType).assert(event);

      logger.debug('event', { name, event });
      callback((0, _createContextFromEvent2.default)(this._ctx, event));
    });
  }

  messageReceived({ type, name, data }) {
    if (type === 'event') {
      if (name === _index.INTERACTIVE_MESSAGE_RESPONSE.toString()) {
        const ctx = (0, _createContextFromInteractiveMessageResponse2.default)(this._ctx, data);
        this.internalEventEmitter.emit(name, ctx);
      }
    }
  }

  start() {
    this.rtm.on(_client.CLIENT_EVENTS.RTM.AUTHENTICATED, ({ self }) => {
      this.id = self.id;
      this.name = self.name;
      logger.debugSuccess('authenticated', { id: self.id, name: self.name });
    });
    this.rtm.on(_client.CLIENT_EVENTS.RTM.RTM_CONNECTION_OPENED, () => {
      logger.infoSuccess('connection opened', { id: this.id, name: this.name });
      if (process.send) process.send('ready');
    });
    this.rtm.start();
    return this;
  }

  close() {
    this.rtm.removeAllListeners();
    this.rtm.disconnect();
    delete this.rtm;
    delete this.webClient;
    delete this.installerUsersWebClients;
  }
}, (_descriptor = _applyDecoratedDescriptor(_class.prototype, 'team', [_dec], {
  enumerable: true,
  initializer: null
}), _descriptor2 = _applyDecoratedDescriptor(_class.prototype, 'rtm', [_dec2], {
  enumerable: true,
  initializer: null
}), _descriptor3 = _applyDecoratedDescriptor(_class.prototype, 'webClient', [_dec3], {
  enumerable: true,
  initializer: null
}), _descriptor4 = _applyDecoratedDescriptor(_class.prototype, 'installerUsersWebClients', [_dec4], {
  enumerable: true,
  initializer: null
}), _descriptor5 = _applyDecoratedDescriptor(_class.prototype, 'middlewares', [_dec5], {
  enumerable: true,
  initializer: function () {
    return [];
  }
}), _descriptor6 = _applyDecoratedDescriptor(_class.prototype, 'id', [_dec6], {
  enumerable: true,
  initializer: null
}), _descriptor7 = _applyDecoratedDescriptor(_class.prototype, 'name', [_dec7], {
  enumerable: true,
  initializer: null
})), _class));
exports.default = Bot;
//# sourceMappingURL=Bot.js.map