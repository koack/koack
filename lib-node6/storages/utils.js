'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

const createInstallation = exports.createInstallation = installInfo => ({
  user: installInfo.user,
  date: installInfo.date,
  scopes: installInfo.scopes
});
const createTeam = exports.createTeam = installInfo => _extends({}, installInfo.team, {
  bot: installInfo.bot,
  installations: [createInstallation(installInfo)]
});

const updateTeam = exports.updateTeam = (team, installInfo) => _extends({}, team, installInfo.team, {
  bot: installInfo.bot,
  installations: [...team.installations, createInstallation(installInfo)]
});
//# sourceMappingURL=utils.js.map