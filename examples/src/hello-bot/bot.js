import 'nightingale-app-console/src';
import { RTM_EVENTS, RTM_MESSAGE_SUBTYPES } from 'koack/src/bot';
import messageEventsRouter from 'koack/src/message-events-router';
import messageRouter from 'koack/src/message-router';
import type { Bot } from 'koack/src/bot';

export default (bot: Bot) => {
  bot.on(
    RTM_EVENTS.CHANNEL_JOINED,
    (ctx) => console.log(ctx),
    async (ctx) => Promise.resolve(console.log(ctx)),
  );

  bot.on(
    RTM_EVENTS.MESSAGE,
    messageEventsRouter([
      {
        events: [RTM_MESSAGE_SUBTYPES.CHANNEL_JOIN, RTM_MESSAGE_SUBTYPES.GROUP_JOIN],
        handler: (ctx) => {
          if (ctx.fromMe) {
            ctx.reply(`Hello ${ctx.mention(ctx.event.inviter)}, thanks for inviting me !`);
          } else {
            ctx.reply(`Welcome ${ctx.mention()} !`);
          }
        },
      },
    ]),
    messageRouter([
      {
        regexp: /\b(hello|hi|hey)\b/,
        // stop: false,
        handler: (ctx) => {
          ctx.reply(`Hello ${ctx.mention()}`);
        },
      },
      {
        where: ['dm'],
        handler: (ctx) => ctx.reply('Sorry, I didn\'t understood you'),
      },
    ]),
  );
};
