import { RTM_EVENTS } from '../../../src/bot';
import messageRouter from '../../../src/message-router';
import type { Bot } from '../../../src/types';

export default (bot: Bot) => {
  bot.on(
    RTM_EVENTS.MESSAGE,
    messageRouter([
      {
        regexp: /\b(hello|hi|hey)\b/,
        stop: false,
        handler: (ctx) => {
          ctx.respond(`Hello`);
        },
      },
    ]),
    (ctx) => ctx.respond('Sorry, I didn\'t understood you'),
  );
}
;
