'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MessageEventType = exports.EventHandlerType = undefined;

var _types = require('../types');

var _flowRuntime = require('flow-runtime');

var _flowRuntime2 = _interopRequireDefault(_flowRuntime);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const WhereType = _flowRuntime2.default.tdz(() => _types.WhereType);

const EventHandlerType = exports.EventHandlerType = _flowRuntime2.default.type('EventHandlerType', _flowRuntime2.default.exactObject(_flowRuntime2.default.property('events', _flowRuntime2.default.array(_flowRuntime2.default.string())), _flowRuntime2.default.property('where', _flowRuntime2.default.nullable(_flowRuntime2.default.array(_flowRuntime2.default.ref(WhereType)))), _flowRuntime2.default.property('handler', _flowRuntime2.default.nullable(_flowRuntime2.default.function())), _flowRuntime2.default.property('middlewares', _flowRuntime2.default.nullable(_flowRuntime2.default.array(_flowRuntime2.default.function())))));

const MessageEventType = exports.MessageEventType = _flowRuntime2.default.type('MessageEventType', _flowRuntime2.default.exactObject(_flowRuntime2.default.property('ts', _flowRuntime2.default.string()), _flowRuntime2.default.property('teamId', _flowRuntime2.default.any()), _flowRuntime2.default.property('userId', _flowRuntime2.default.any()), _flowRuntime2.default.property('channelId', _flowRuntime2.default.any())));
//# sourceMappingURL=types.js.map