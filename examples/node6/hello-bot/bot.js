'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _bot = require('koack/bot');

var _messageEventsRouter = require('koack/message-events-router');

var _messageEventsRouter2 = _interopRequireDefault(_messageEventsRouter);

var _messageRouter = require('koack/message-router');

var _messageRouter2 = _interopRequireDefault(_messageRouter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function bot(bot) {
  bot.on(_bot.RTM_EVENTS.MESSAGE, (0, _messageEventsRouter2.default)([{
    events: [_bot.RTM_MESSAGE_SUBTYPES.CHANNEL_JOIN, _bot.RTM_MESSAGE_SUBTYPES.GROUP_JOIN],
    handler: ctx => {
      if (ctx.fromMe) {
        ctx.reply(`Hello ${ ctx.mention(ctx.event.inviter) }, thanks for inviting me !`);
      } else {
        ctx.reply(`Welcome ${ ctx.mention() } !`);
      }
    }
  }]), (0, _messageRouter2.default)([{
    regexp: /\b(hello|hi|hey)\b/,
    // stop: false,
    handler: ctx => {
      ctx.reply(`Hello ${ ctx.mention() }`);
    }
  }, {
    where: ['dm'],
    handler: ctx => ctx.reply('Sorry, I didn\'t understood you')
  }]));
};
//# sourceMappingURL=bot.js.map