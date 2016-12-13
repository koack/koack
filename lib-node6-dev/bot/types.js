'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MiddlewareType = exports.NextCallbackType = exports.ContextType = undefined;

var _tcombForked = require('tcomb-forked');

var _tcombForked2 = _interopRequireDefault(_tcombForked);

var _client = require('@slack/client');

var _nightingaleLogger = require('nightingale-logger');

var _nightingaleLogger2 = _interopRequireDefault(_nightingaleLogger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import Bot from './Bot';

// export type ContextType<EventType> = {
const ContextType = exports.ContextType = _tcombForked2.default.interface({
  rtm: _client.RtmClient,
  webClient: _client.WebClient,
  logger: _nightingaleLogger2.default,
  event: _tcombForked2.default.Object,
  teamId: _tcombForked2.default.maybe(_tcombForked2.default.Any),
  userId: _tcombForked2.default.maybe(_tcombForked2.default.Any),
  channelId: _tcombForked2.default.maybe(_tcombForked2.default.Any)
}, 'ContextType');

const NextCallbackType = exports.NextCallbackType = _tcombForked2.default.Function;
const MiddlewareType = exports.MiddlewareType = _tcombForked2.default.Function;
//# sourceMappingURL=types.js.map