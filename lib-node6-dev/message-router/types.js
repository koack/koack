'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MessageType = exports.ActionType = undefined;

var _tcombForked = require('tcomb-forked');

var _tcombForked2 = _interopRequireDefault(_tcombForked);

var _types = require('../types');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const ActionType = exports.ActionType = _tcombForked2.default.interface({
  commands: _tcombForked2.default.maybe(_tcombForked2.default.list(_tcombForked2.default.String)),
  where: _tcombForked2.default.maybe(_tcombForked2.default.list(_types.WhereType)),
  regexp: _tcombForked2.default.maybe(RegExp),
  stop: _tcombForked2.default.maybe(_tcombForked2.default.Boolean),
  mention: _tcombForked2.default.union([_tcombForked2.default.maybe(_tcombForked2.default.refinement(_tcombForked2.default.Boolean, function (b) {
    return b === false;
  })), _tcombForked2.default.list(_types.WhereType)]),
  handler: _tcombForked2.default.maybe(_tcombForked2.default.Function),
  middlewares: _tcombForked2.default.maybe(_tcombForked2.default.list(_tcombForked2.default.Function))
}, {
  name: 'ActionType',
  strict: true
});

const MessageType = exports.MessageType = _tcombForked2.default.interface({
  ts: _tcombForked2.default.String,
  text: _tcombForked2.default.String,
  teamId: _tcombForked2.default.Any,
  userId: _tcombForked2.default.Any,
  channelId: _tcombForked2.default.Any
}, {
  name: 'MessageType',
  strict: true
});
//# sourceMappingURL=types.js.map