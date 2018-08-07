import 'nightingale-app-console';
import messageEventsRouter from 'koack-message-events-router';
import messageRouter from 'koack-message-router';
// import Bot from 'koack-bot';

export default bot => {
  bot.on('channel_joined', ctx => console.log(ctx), async ctx => Promise.resolve(console.log(ctx)));

  bot.on(
    'message',
    messageEventsRouter([
      {
        // ['message::channel_join', 'message::group_join'],
        events: ['channel_join', 'group_join'],
        handler: ctx => {
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
        handler: ctx => {
          ctx.reply(`Hello ${ctx.mention()}`);
        },
      },
      {
        where: ['dm'],
        handler: ctx => ctx.reply("Sorry, I didn't understood you"),
      },
    ]),
  );
};
