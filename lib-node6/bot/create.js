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
  const rtm = new _client.RtmClient(team.token, {
    logLevel: 'error',
    autoReconnect: true,
    autoMark: true,
    dataStore: new _client.MemoryDataStore()
  });

  const webClient = new _client.WebClient(team.token);

  const installerUsersWebClients = !team.installerUsers ? null : new Map(team.installerUsers.map(user => [user.slackId, new _client.WebClient(user.token)]));

  rtm.start();

  return new _Bot2.default({ team, rtm, webClient, installerUsersWebClients });
}
//# sourceMappingURL=create.js.map