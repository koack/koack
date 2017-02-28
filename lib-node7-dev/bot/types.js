'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MiddlewareType = exports.NextCallbackType = exports.EventContextType = exports.ContextType = undefined;

var _client = require('@slack/client');

var _nightingaleLogger = require('nightingale-logger');

var _nightingaleLogger2 = _interopRequireDefault(_nightingaleLogger);

var _flowRuntime = require('flow-runtime');

var _flowRuntime2 = _interopRequireDefault(_flowRuntime);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import Bot from './Bot';

// export type ContextType<EventType> = {
const ContextType = exports.ContextType = _flowRuntime2.default.type('ContextType', _flowRuntime2.default.object(_flowRuntime2.default.property('rtm', _flowRuntime2.default.ref(_client.RtmClient)), _flowRuntime2.default.property('webClient', _flowRuntime2.default.ref(_client.WebClient)), _flowRuntime2.default.property('logger', _flowRuntime2.default.ref(_nightingaleLogger2.default)), _flowRuntime2.default.property('teamId', _flowRuntime2.default.nullable(_flowRuntime2.default.any())), _flowRuntime2.default.property('userId', _flowRuntime2.default.nullable(_flowRuntime2.default.any())), _flowRuntime2.default.property('channelId', _flowRuntime2.default.nullable(_flowRuntime2.default.any()))));

const EventContextType = exports.EventContextType = _flowRuntime2.default.type('EventContextType', _flowRuntime2.default.object(_flowRuntime2.default.property('event', _flowRuntime2.default.object())));

const NextCallbackType = exports.NextCallbackType = _flowRuntime2.default.type('NextCallbackType', _flowRuntime2.default.function(_flowRuntime2.default.return(_flowRuntime2.default.object())));

const MiddlewareType = exports.MiddlewareType = _flowRuntime2.default.type('MiddlewareType', _flowRuntime2.default.function(_flowRuntime2.default.param('ctx', ContextType), _flowRuntime2.default.param('next', NextCallbackType), _flowRuntime2.default.return(_flowRuntime2.default.object())));
//# sourceMappingURL=types.js.map