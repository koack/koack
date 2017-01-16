'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StorageType = exports.WhereType = exports.InstallInfoType = exports.TeamType = exports.InstallationInfoType = exports.UserType = undefined;

var _tcombForked = require('tcomb-forked');

var _tcombForked2 = _interopRequireDefault(_tcombForked);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const UserType = exports.UserType = _tcombForked2.default.interface({
  id: _tcombForked2.default.String,
  name: _tcombForked2.default.maybe(_tcombForked2.default.String),
  accessToken: _tcombForked2.default.String
}, 'UserType');

const InstallationInfoType = exports.InstallationInfoType = _tcombForked2.default.interface({
  user: UserType,
  date: _tcombForked2.default.union([Date, _tcombForked2.default.String]),
  scopes: _tcombForked2.default.list(_tcombForked2.default.String)
}, 'InstallationInfoType');

const TeamType = exports.TeamType = _tcombForked2.default.interface({
  id: _tcombForked2.default.String,
  name: _tcombForked2.default.String,
  bot: UserType,
  installations: _tcombForked2.default.maybe(_tcombForked2.default.list(InstallationInfoType))
}, 'TeamType');

const InstallInfoType = exports.InstallInfoType = _tcombForked2.default.intersection([InstallationInfoType, _tcombForked2.default.interface({
  team: _tcombForked2.default.interface({
    id: _tcombForked2.default.String,
    name: _tcombForked2.default.String
  }),
  bot: UserType
})], 'InstallInfoType');

const WhereType = exports.WhereType = _tcombForked2.default.enums.of(['dm', 'channel', 'group'], 'WhereType');

const CallbackTeamType = _tcombForked2.default.Function;

const StorageType = exports.StorageType = _tcombForked2.default.interface({
  forEach: _tcombForked2.default.Function,
  installedTeam: _tcombForked2.default.Function
}, 'StorageType');
//# sourceMappingURL=index.js.map