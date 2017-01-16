'use strict';

require('nightingale-app-console');

var _pool = require('koack/pool');

var _pool2 = _interopRequireDefault(_pool);

var _server = require('koack/server');

var _server2 = _interopRequireDefault(_server);

var _memory = require('koack/storages/memory');

var _memory2 = _interopRequireDefault(_memory);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const pool = new _pool2.default({
  size: 100,
  path: require.resolve('../hello-bot/bot')
});

const server = new _server2.default({
  pool,
  scopes: ['bot'],
  slackClient: _config2.default.slackClient,
  storage: (0, _memory2.default)()
});

server.listen({ port: process.env.PORT || 3000 });
//# sourceMappingURL=index.js.map