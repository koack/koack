'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createBot;

var _client = require('@slack/client');

var _Bot = require('./Bot');

var _Bot2 = _interopRequireDefault(_Bot);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createBot(team) {
  const rtm = new _client.RtmClient(team.bot.accessToken, {
    logLevel: 'error',
    autoReconnect: true,
    autoMark: true,
    dataStore: new _client.MemoryDataStore()
  });

  const webClient = new _client.WebClient(team.bot.accessToken);

  const installerUsersWebClients = new Map();
  if (team.installations) {
    team.installations.forEach(installation => installerUsersWebClients.set(installation.user.id, installation.user.accessToken));

    installerUsersWebClients.forEach((accessToken, id) => installerUsersWebClients.set(id, new _client.WebClient(accessToken)));
  }

  rtm.start();

  return new _Bot2.default({ team, rtm, webClient, installerUsersWebClients });
}
//# sourceMappingURL=create.js.map