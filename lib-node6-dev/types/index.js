'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WhereType = exports.TeamType = exports.UserType = undefined;

var _tcombForked = require('tcomb-forked');

var _tcombForked2 = _interopRequireDefault(_tcombForked);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const UserType = exports.UserType = _tcombForked2.default.interface({
  slackId: _tcombForked2.default.String,
  token: _tcombForked2.default.String
}, 'UserType');

const TeamType = exports.TeamType = _tcombForked2.default.interface({
  id: _tcombForked2.default.maybe(_tcombForked2.default.Any),
  name: _tcombForked2.default.maybe(_tcombForked2.default.String),
  token: _tcombForked2.default.String,
  installerUsers: _tcombForked2.default.maybe(_tcombForked2.default.list(UserType))
}, 'TeamType');

const WhereType = exports.WhereType = _tcombForked2.default.enums.of(['dm', 'channel', 'group'], 'WhereType');
//# sourceMappingURL=index.js.map