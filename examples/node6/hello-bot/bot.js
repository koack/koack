'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _bot = require('koack/bot');

var _messageRouter = require('koack/message-router');

var _messageRouter2 = _interopRequireDefault(_messageRouter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function bot(bot) {
  bot.on(_bot.RTM_EVENTS.MESSAGE, (0, _messageRouter2.default)([{
    regexp: /\b(hello|hi|hey)\b/,
    // stop: false,
    handler: ctx => {
      ctx.reply('Hello');
    }
  }, {
    where: ['dm'],
    handler: ctx => ctx.reply('Sorry, I didn\'t understood you')
  }]));
};
//# sourceMappingURL=bot.js.map