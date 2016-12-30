'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _nightingaleLogger = require('nightingale-logger');

var _nightingaleLogger2 = _interopRequireDefault(_nightingaleLogger);

var _koaCompose = require('koa-compose');

var _koaCompose2 = _interopRequireDefault(_koaCompose);

var _contextPrototype = require('./contextPrototype');

var _contextPrototype2 = _interopRequireDefault(_contextPrototype);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const logger = new _nightingaleLogger2.default('koack:bot');

class Bot {

  constructor(data) {
    this.middlewares = [];

    Object.assign(this, data);
    this.context = Object.create(_contextPrototype2.default);
  }

  use(middleware) {
    logger.debug('use middleware', { name: middleware.name });
    this.middlewares.push(middleware);
  }

  on(name, ...middlewares) {
    const allMiddlewares = [...this.middlewares, ...middlewares];
    logger.debug('register middlewares on event', { name, middlewareLength: allMiddlewares.length });
    const callback = (0, _koaCompose2.default)(allMiddlewares);
    this.rtm.on(name, event => callback(this.createContext(event)));
  }

  createContext(event) {
    const ctx = Object.create(_contextPrototype2.default);

    Object.assign(ctx, {
      bot: this,
      rtm: this.rtm,
      webClient: this.webClient,
      event,
      teamId: event.team,
      userId: event.user,
      channelId: event.channel
    });

    ctx.logger = new _nightingaleLogger2.default('bot');
    ctx.logger.setContext({
      team: this.team,
      user: ctx.user && ctx.user.name,
      text: event.text
    });

    return ctx;
  }

  close() {
    this.rtm.removeAllListeners();
    this.rtm.disconnect();
    delete this.rtm;
    delete this.webClient;
    delete this.installerUsersWebClients;
  }
}
exports.default = Bot;
//# sourceMappingURL=Bot.js.map