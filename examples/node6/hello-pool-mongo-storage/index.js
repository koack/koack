'use strict';

require('nightingale-app-console');

var _pool = require('koack/pool');

var _pool2 = _interopRequireDefault(_pool);

var _server = require('koack/server');

var _server2 = _interopRequireDefault(_server);

var _mongoStorage = require('koack/mongo-storage');

var _mongoStorage2 = _interopRequireDefault(_mongoStorage);

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
  slackClient: _config2.default.slackClient
});

(0, _mongoStorage2.default)(server, process.env.MONGO || 'mongodb://localhost:27017/hello-pool');

server.listen({ port: process.env.PORT || 3000 });
//# sourceMappingURL=index.js.map