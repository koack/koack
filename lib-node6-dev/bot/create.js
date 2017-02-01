'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createBot;

var _tcombForked = require('tcomb-forked');

var _tcombForked2 = _interopRequireDefault(_tcombForked);

var _client = require('@slack/client');

var _Bot = require('./Bot');

var _Bot2 = _interopRequireDefault(_Bot);

var _types = require('../types/');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const TeamOrTokenType = _tcombForked2.default.union([_types.TeamType, _tcombForked2.default.String], 'TeamOrTokenType');

function createBot(teamOrAccessToken) {
  _assert(teamOrAccessToken, TeamOrTokenType, 'teamOrAccessToken');

  const team = typeof teamOrAccessToken === 'string' ? null : teamOrAccessToken;
  const accessToken = team ? team.bot.accessToken : teamOrAccessToken;

  const rtm = new _client.RtmClient(accessToken, {
    logLevel: 'info',
    autoReconnect: true,
    autoMark: true,
    dataStore: new _client.MemoryDataStore()
  });

  const webClient = new _client.WebClient(accessToken);

  const installerUsersWebClients = new Map();
  if (team && team.installations) {
    team.installations.forEach(installation => installerUsersWebClients.set(installation.user.id, installation.user.accessToken));

    installerUsersWebClients.forEach((accessToken, id) => installerUsersWebClients.set(id, new _client.WebClient(accessToken)));
  }

  const bot = new _Bot2.default({ team, rtm, webClient, installerUsersWebClients });
  return bot.start();
}

function _assert(x, type, name) {
  if (false) {
    _tcombForked2.default.fail = function (message) {
      console.warn(message);
    };
  }

  if (_tcombForked2.default.isType(type) && type.meta.kind !== 'struct') {
    if (!type.is(x)) {
      type(x, [name + ': ' + _tcombForked2.default.getTypeName(type)]);
    }
  } else if (!(x instanceof type)) {
    _tcombForked2.default.fail('Invalid value ' + _tcombForked2.default.stringify(x) + ' supplied to ' + name + ' (expected a ' + _tcombForked2.default.getTypeName(type) + ')');
  }

  return x;
}
//# sourceMappingURL=create.js.map