'use strict';

require('nightingale-app-console');

var _pool = require('koack/pool');

var _pool2 = _interopRequireDefault(_pool);

var _server = require('koack/server');

var _server2 = _interopRequireDefault(_server);

var _mongo = require('koack/storages/mongo');

var _mongo2 = _interopRequireDefault(_mongo);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

_asyncToGenerator(function* () {
  const pool = new _pool2.default({
    size: 100,
    path: require.resolve('../hello-bot/bot')
  });

  const storage = yield (0, _mongo2.default)(process.env.MONGO || 'mongodb://localhost:27017/hello-pool');
  const server = new _server2.default({
    pool,
    scopes: ['bot'],
    slackClient: _config2.default.slackClient,
    storage
  });

  server.listen({ port: process.env.PORT || 3000 });
})();
//# sourceMappingURL=index.js.map