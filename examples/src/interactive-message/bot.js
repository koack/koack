import 'nightingale-app-console/src';
import { INTERACTIVE_MESSAGE_RESPONSE } from 'koack/src/';
import { RTM_EVENTS } from 'koack/src/bot';
import messageRouter from 'koack/src/message-router';
import type { Bot } from 'koack/src/bot';
// import { INTERACTIVE_MESSAGE_RESPONSE } from 'koack/src/interactive-message';

export default (bot: Bot) => {
  bot.on(
    RTM_EVENTS.MESSAGE,
    messageRouter([
      {
        regexp: /\b(hello|hi|hey)\b/,
        // stop: false,
        handler: (ctx) => {
          ctx.reply(`Hello ${ctx.mention()}`);
          ctx.reply('Having a good day ?', {
            attachments: [
              {
                text: 'Choose if you have a good day or not',
                fallback: 'You are unable to choose',
                callbackId: 'goodDay',
                actions: [
                  { name: 'yes', text: 'Yes', type: 'button', value: 'yes' },
                  { name: 'no', text: 'No', type: 'button', value: 'no' },
                  { name: 'yes', text: 'Yes (Ephemeral)', type: 'button', value: 'yes-ephemeral' },
                  { name: 'no', text: 'No (Ephemeral)', type: 'button', value: 'no-ephemeral' },
                  { name: 'yes', text: 'Yes (Replace)', type: 'button', value: 'yes-replace' },
                  { name: 'no', text: 'No (Replace)', type: 'button', value: 'no-replace' },
                ],
              },
            ],
          });
        },
      },
    ]),
  );

  bot.on(INTERACTIVE_MESSAGE_RESPONSE, (ctx) => {
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
