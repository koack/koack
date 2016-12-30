'use strict';

require('nightingale-app-console');

var _bot = require('koack/bot');

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

var _bot2 = require('./bot');

var _bot3 = _interopRequireDefault(_bot2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const bot = (0, _bot.createBot)(_config2.default.token);
(0, _bot3.default)(bot);
//# sourceMappingURL=index.js.map