'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MessageType = exports.ActionType = undefined;

var _types = require('../types');

var _flowRuntime = require('flow-runtime');

var _flowRuntime2 = _interopRequireDefault(_flowRuntime);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const WhereType = _flowRuntime2.default.tdz(() => _types.WhereType);

const ActionType = exports.ActionType = _flowRuntime2.default.type('ActionType', _flowRuntime2.default.exactObject(_flowRuntime2.default.property('commands', _flowRuntime2.default.nullable(_flowRuntime2.default.array(_flowRuntime2.default.string()))), _flowRuntime2.default.property('where', _flowRuntime2.default.nullable(_flowRuntime2.default.array(_flowRuntime2.default.ref(WhereType)))), _flowRuntime2.default.property('regexp', _flowRuntime2.default.nullable(_flowRuntime2.default.ref('RegExp'))), _flowRuntime2.default.property('stop', _flowRuntime2.default.nullable(_flowRuntime2.default.boolean())), _flowRuntime2.default.property('mention', _flowRuntime2.default.union(_flowRuntime2.default.nullable(_flowRuntime2.default.boolean(false)), _flowRuntime2.default.array(_flowRuntime2.default.ref(WhereType)))), _flowRuntime2.default.property('handler', _flowRuntime2.default.nullable(_flowRuntime2.default.function())), _flowRuntime2.default.property('middlewares', _flowRuntime2.default.nullable(_flowRuntime2.default.array(_flowRuntime2.default.function())))));

const MessageType = exports.MessageType = _flowRuntime2.default.type('MessageType', _flowRuntime2.default.exactObject(_flowRuntime2.default.property('ts', _flowRuntime2.default.string()), _flowRuntime2.default.property('text', _flowRuntime2.default.string()), _flowRuntime2.default.property('teamId', _flowRuntime2.default.any()), _flowRuntime2.default.property('userId', _flowRuntime2.default.any()), _flowRuntime2.default.property('channelId', _flowRuntime2.default.any())));
//# sourceMappingURL=types.js.map