'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MessageEventType = exports.EventHandlerType = undefined;

var _tcombForked = require('tcomb-forked');

var _tcombForked2 = _interopRequireDefault(_tcombForked);

var _types = require('../types');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const EventHandlerType = exports.EventHandlerType = _tcombForked2.default.interface({
  events: _tcombForked2.default.list(_tcombForked2.default.String),
  where: _tcombForked2.default.maybe(_tcombForked2.default.list(_types.WhereType)),
  handler: _tcombForked2.default.maybe(_tcombForked2.default.Function),
  middlewares: _tcombForked2.default.maybe(_tcombForked2.default.list(_tcombForked2.default.Function))
}, {
  name: 'EventHandlerType',
  strict: true
});

const MessageEventType = exports.MessageEventType = _tcombForked2.default.interface({
  ts: _tcombForked2.default.String,
  teamId: _tcombForked2.default.Any,
  userId: _tcombForked2.default.Any,
  channelId: _tcombForked2.default.Any
}, {
  name: 'MessageEventType',
  strict: true
});
//# sourceMappingURL=types.js.map