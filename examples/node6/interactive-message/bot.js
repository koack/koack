'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

require('nightingale-app-console');

var _koack = require('koack/');

var _bot = require('koack/bot');

var _messageRouter = require('koack/message-router');

var _messageRouter2 = _interopRequireDefault(_messageRouter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import { INTERACTIVE_MESSAGE_RESPONSE } from 'koack/src/interactive-message';

exports.default = bot => {
  bot.on(_bot.RTM_EVENTS.MESSAGE, (0, _messageRouter2.default)([{
    regexp: /\b(hello|hi|hey)\b/,
    // stop: false,
    handler: ctx => {
      ctx.reply(`Hello ${ctx.mention()}`);
      ctx.reply('Having a good day ?', {
        attachments: [{
          text: 'Choose if you have a good day or not',
          fallback: 'You are unable to choose',
          callbackId: 'goodDay',
          actions: [{ name: 'yes', text: 'Yes', type: 'button', value: 'yes' }, { name: 'no', text: 'No', type: 'button', value: 'no' }, { name: 'yes', text: 'Yes (Ephemeral)', type: 'button', value: 'yes-ephemeral' }, { name: 'no', text: 'No (Ephemeral)', type: 'button', value: 'no-ephemeral' }, { name: 'yes', text: 'Yes (Replace)', type: 'button', value: 'yes-replace' }, { name: 'no', text: 'No (Replace)', type: 'button', value: 'no-replace' }]
        }]
      });
    }
  }]));

  bot.on(_koack.INTERACTIVE_MESSAGE_RESPONSE, ctx => {
    if (ctx.actions[0].value === 'yes') {
      ctx.reply('Great ! So happy for you !');
    } else if (ctx.actions[0].value === 'no') {
      ctx.reply('I hope it will improve !');
    } else if (ctx.actions[0].value === 'yes-ephemeral') {
      ctx.replyEphemeral('Great ! So happy for you !');
    } else if (ctx.actions[0].value === 'no-ephemeral') {
      ctx.replyEphemeral('I hope it will improve !');
    } else if (ctx.actions[0].value === 'yes-replace') {
      ctx.reply('Great ! So happy for you !', { replace: true });
    } else if (ctx.actions[0].value === 'no-replace') {
      ctx.reply('I hope it will improve !', { replace: true });
    } else {
      ctx.reply('Error.');
    }
  });
};
//# sourceMappingURL=bot.js.map