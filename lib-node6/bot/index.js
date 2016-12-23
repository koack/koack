'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createBot = exports.RTM_MESSAGE_SUBTYPES = exports.RTM_EVENTS = undefined;

var _client = require('@slack/client');

Object.defineProperty(exports, 'RTM_EVENTS', {
  enumerable: true,
  get: function () {
    return _client.RTM_EVENTS;
  }
});
Object.defineProperty(exports, 'RTM_MESSAGE_SUBTYPES', {
  enumerable: true,
  get: function () {
    return _client.RTM_MESSAGE_SUBTYPES;
  }
});

var _create = require('./create');

var _create2 = _interopRequireDefault(_create);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.createBot = _create2.default;
//# sourceMappingURL=index.js.map