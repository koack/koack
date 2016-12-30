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

function createBot(team) {
  _assert(team, _types.TeamType, 'team');

  const rtm = new _client.RtmClient(team.bot.accessToken, {
    logLevel: 'info',
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

function _assert(x, type, name) {
  function message() {
    return 'Invalid value ' + _tcombForked2.default.stringify(x) + ' supplied to ' + name + ' (expected a ' + _tcombForked2.default.getTypeName(type) + ')';
  }

  if (_tcombForked2.default.isType(type)) {
    if (!type.is(x)) {
      type(x, [name + ': ' + _tcombForked2.default.getTypeName(type)]);

      _tcombForked2.default.fail(message());
    }
  } else if (!(x instanceof type)) {
    _tcombForked2.default.fail(message());
  }

  return x;
}
//# sourceMappingURL=create.js.map