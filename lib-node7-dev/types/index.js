'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StorageType = exports.WhereType = exports.InstallInfoType = exports.TeamType = exports.TeamIdType = exports.InstallationInfoType = exports.UserType = undefined;

var _flowRuntime = require('flow-runtime');

var _flowRuntime2 = _interopRequireDefault(_flowRuntime);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const UserType = exports.UserType = _flowRuntime2.default.type('UserType', _flowRuntime2.default.object(_flowRuntime2.default.property('id', _flowRuntime2.default.string()), _flowRuntime2.default.property('name', _flowRuntime2.default.nullable(_flowRuntime2.default.string())), _flowRuntime2.default.property('accessToken', _flowRuntime2.default.string())));

const InstallationInfoType = exports.InstallationInfoType = _flowRuntime2.default.type('InstallationInfoType', _flowRuntime2.default.object(_flowRuntime2.default.property('user', UserType), _flowRuntime2.default.property('date', _flowRuntime2.default.union(_flowRuntime2.default.ref('Date'), _flowRuntime2.default.string())), _flowRuntime2.default.property('scopes', _flowRuntime2.default.array(_flowRuntime2.default.string()))));

const TeamIdType = exports.TeamIdType = _flowRuntime2.default.type('TeamIdType', _flowRuntime2.default.string());

const TeamType = exports.TeamType = _flowRuntime2.default.type('TeamType', _flowRuntime2.default.object(_flowRuntime2.default.property('id', TeamIdType), _flowRuntime2.default.property('name', _flowRuntime2.default.string()), _flowRuntime2.default.property('bot', UserType), _flowRuntime2.default.property('installations', _flowRuntime2.default.nullable(_flowRuntime2.default.array(InstallationInfoType)))));

const InstallInfoType = exports.InstallInfoType = _flowRuntime2.default.type('InstallInfoType', _flowRuntime2.default.intersection(InstallationInfoType, _flowRuntime2.default.object(_flowRuntime2.default.property('team', _flowRuntime2.default.object(_flowRuntime2.default.property('id', _flowRuntime2.default.string()), _flowRuntime2.default.property('name', _flowRuntime2.default.string()))), _flowRuntime2.default.property('bot', UserType))));

const WhereType = exports.WhereType = _flowRuntime2.default.type('WhereType', _flowRuntime2.default.union(_flowRuntime2.default.string('dm'), _flowRuntime2.default.string('channel'), _flowRuntime2.default.string('group')));

const CallbackTeamType = _flowRuntime2.default.type('CallbackTeamType', _flowRuntime2.default.function(_flowRuntime2.default.param('team', TeamType), _flowRuntime2.default.return(_flowRuntime2.default.void())));

const StorageType = exports.StorageType = _flowRuntime2.default.type('StorageType', _flowRuntime2.default.object(_flowRuntime2.default.property('forEach', _flowRuntime2.default.function(_flowRuntime2.default.param('callback', CallbackTeamType), _flowRuntime2.default.return(_flowRuntime2.default.void()))), _flowRuntime2.default.property('installedTeam', _flowRuntime2.default.function(_flowRuntime2.default.param('installInfo', InstallInfoType), _flowRuntime2.default.return(_flowRuntime2.default.union(_flowRuntime2.default.ref('Promise', TeamType), TeamType))))));
//# sourceMappingURL=index.js.map