'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

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

var _index = require('../index');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const logger = new _nightingaleLogger2.default('koack:bot');

let Bot = class {
  /** bot name in the team */
  constructor(data) {
    this.middlewares = [];
    this.internalEventEmitter = new _events.EventEmitter();

    Object.assign(this, data);
    this._ctx = (0, _createContextFromBot2.default)(this);
  }
  /** bot id in the team */


  use(middleware) {
    logger.debug('use middleware', { name: middleware.name });
    this.middlewares.push(middleware);
  }

  on(name, ...middlewares) {
    const allMiddlewares = [...this.middlewares, ...middlewares];
    logger.debug('register middlewares on event', { name, middlewareLength: allMiddlewares.length });
    const callback = (0, _koaCompose2.default)(allMiddlewares);

    if (typeof name === 'symbol') {
      this.internalEventEmitter.on(name.toString(), callback);
      return;
    }

    this.rtm.on(name, event => {
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
};
exports.default = Bot;
//# sourceMappingURL=Bot.js.map