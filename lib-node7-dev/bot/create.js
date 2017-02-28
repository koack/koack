'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createBot;

var _client = require('@slack/client');

var _Bot = require('./Bot');

var _Bot2 = _interopRequireDefault(_Bot);

var _types = require('../types/');

var _flowRuntime = require('flow-runtime');

var _flowRuntime2 = _interopRequireDefault(_flowRuntime);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const TeamType = _flowRuntime2.default.tdz(() => _types.TeamType);

const TeamOrTokenType = _flowRuntime2.default.type('TeamOrTokenType', _flowRuntime2.default.union(_flowRuntime2.default.ref(TeamType), _flowRuntime2.default.string()));

function createBot(teamOrAccessToken) {
  _flowRuntime2.default.param('teamOrAccessToken', TeamOrTokenType).assert(teamOrAccessToken);

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
//# sourceMappingURL=create.js.map