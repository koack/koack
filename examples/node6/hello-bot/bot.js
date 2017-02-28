'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

require('nightingale-app-console');

var _bot = require('koack/bot');

var _messageEventsRouter = require('koack/message-events-router');

var _messageEventsRouter2 = _interopRequireDefault(_messageEventsRouter);

var _messageRouter = require('koack/message-router');

var _messageRouter2 = _interopRequireDefault(_messageRouter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = bot => {
  bot.on(_bot.RTM_EVENTS.CHANNEL_JOINED, ctx => console.log(ctx), (() => {
    var _ref = _asyncToGenerator(function* (ctx) {
      return Promise.resolve(console.log(ctx));
    });

    return function () {
      return _ref.apply(this, arguments);
    };
  })());

  bot.on(_bot.RTM_EVENTS.MESSAGE, (0, _messageEventsRouter2.default)([{
    events: [_bot.RTM_MESSAGE_SUBTYPES.CHANNEL_JOIN, _bot.RTM_MESSAGE_SUBTYPES.GROUP_JOIN],
    handler: ctx => {
      if (ctx.fromMe) {
        ctx.reply(`Hello ${ctx.mention(ctx.event.inviter)}, thanks for inviting me !`);
      } else {
        ctx.reply(`Welcome ${ctx.mention()} !`);
      }
    }
  }]), (0, _messageRouter2.default)([{
    regexp: /\b(hello|hi|hey)\b/,
    // stop: false,
    handler: ctx => {
      ctx.reply(`Hello ${ctx.mention()}`);
    }
  }, {
    where: ['dm'],
    handler: ctx => ctx.reply('Sorry, I didn\'t understood you')
  }]));
};
//# sourceMappingURL=bot.js.map