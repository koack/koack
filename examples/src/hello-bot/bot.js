import { RTM_EVENTS } from 'koack/src/bot';
import messageRouter from 'koack/src/message-router';
import type { Bot } from 'koack/src/types';

export default (bot: Bot) => {
  bot.on(
    RTM_EVENTS.MESSAGE,
    messageRouter([
      {
        regexp: /\b(hello|hi|hey)\b/,
        // stop: false,
        handler: (ctx) => {
          ctx.reply('Hello');
        },
      },
      {
        where: ['dm'],
        handler: (ctx) => ctx.reply('Sorry, I didn\'t understood you'),
      },
    ]),
  );
}
;
