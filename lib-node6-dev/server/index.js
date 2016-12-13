'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _koa = require('koa');

var _koa2 = _interopRequireDefault(_koa);

var _koaBodyparser = require('koa-bodyparser');

var _koaBodyparser2 = _interopRequireDefault(_koaBodyparser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class SlackServer extends _koa2.default {
  constructor(...args) {
    super(...args);
    this.use((0, _koaBodyparser2.default)());
  }

}
exports.default = SlackServer;
//# sourceMappingURL=index.js.map