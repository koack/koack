var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _desc, _value, _class, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7;

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

import { RtmClient, WebClient, CLIENT_EVENTS } from '@slack/client';
import Logger from 'nightingale-logger';
import compose from 'koa-compose';
import createContextFromEvent from './context/createContextFromEvent';
import { MiddlewareType as _MiddlewareType } from './types';
import { TeamType as _TeamType } from '../types';

import t from 'flow-runtime';
const TeamType = t.tdz(() => _TeamType);
const MiddlewareType = t.tdz(() => _MiddlewareType);
const BotConstructorArguments = t.type('BotConstructorArguments', t.exactObject(t.property('team', t.nullable(t.ref(TeamType))), t.property('rtm', t.ref(RtmClient)), t.property('webClient', t.ref(WebClient)), t.property('installerUsersWebClients', t.union(t.null(), t.ref('Map', t.string(), t.ref(WebClient))))));


const logger = new Logger('koack:bot');

let Bot = (_dec = t.decorate(t.nullable(t.ref(TeamType))), _dec2 = t.decorate(function () {
  return t.ref(RtmClient);
}), _dec3 = t.decorate(function () {
  return t.ref(WebClient);
}), _dec4 = t.decorate(function () {
  return t.union(t.null(), t.ref('Map', t.string(), t.ref(WebClient)));
}), _dec5 = t.decorate(t.array(t.ref(MiddlewareType))), _dec6 = t.decorate(t.nullable(t.string())), _dec7 = t.decorate(t.nullable(t.string())), (_class = class {
  /** bot id in the team */
  constructor(data) {
    _initDefineProp(this, 'team', _descriptor, this);

    _initDefineProp(this, 'rtm', _descriptor2, this);

    _initDefineProp(this, 'webClient', _descriptor3, this);

    _initDefineProp(this, 'installerUsersWebClients', _descriptor4, this);

    _initDefineProp(this, 'middlewares', _descriptor5, this);

    _initDefineProp(this, 'id', _descriptor6, this);

    _initDefineProp(this, 'name', _descriptor7, this);

    t.param('data', BotConstructorArguments).assert(data);

    Object.assign(this, data);
  }
  /** bot name in the team */


  use(middleware) {
    let _middlewareType = t.ref(MiddlewareType);

    t.param('middleware', _middlewareType).assert(middleware);

    logger.debug('use middleware', { name: middleware.name });
    this.middlewares.push(middleware);
  }

  on(name, ...middlewares) {
    let _nameType = t.string();

    let _middlewaresType = t.array(t.ref(MiddlewareType));

    t.param('name', _nameType).assert(name);
    t.rest('middlewares', _middlewaresType).assert(middlewares);

    const allMiddlewares = [...this.middlewares, ...middlewares];
    logger.debug('register middlewares on event', { name, middlewareLength: allMiddlewares.length });
    const callback = compose(allMiddlewares);
    this.rtm.on(name, event => {
      let _eventType = t.object();

      t.param('event', _eventType).assert(event);

      logger.debug('event', { name, event });
      callback(createContextFromEvent(this, event));
    });
  }

  start() {
    this.rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, ({ self }) => {
      this.id = self.id;
      this.name = self.name;
      logger.debugSuccess('authenticated', { id: self.id, name: self.name });
    });
    this.rtm.on(CLIENT_EVENTS.RTM.RTM_CONNECTION_OPENED, () => {
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
export { Bot as default };
//# sourceMappingURL=Bot.js.map