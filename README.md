# koack [![NPM version][npm-image]][npm-url]

Core brick to build Slack bots

[![Build Status][circleci-status-image]][circleci-status-url]
[![Travis Status][travisci-status-image]][travisci-status-url]
[![Dependency ci Status][dependencyci-image]][dependencyci-url]
[![Dependency Status][daviddm-image]][daviddm-url]
[![Coverage percentage][coverage-image]][coverage-url]

## Nightingale

To read the full documentation on nightingale, go to [nightingale](https://npmjs.com/package/nightingale)

## Install

```sh
npm install --save koack
```

## API

[https://christophehurpeau.github.io/koack/docs](http://christophehurpeau.github.io/koack/docs)

## Usages

### The bot

> bot.js

```js
import { RTM_EVENTS } from 'koack/bot';
import messageRouter from 'koack/message-router';
import type { Bot } from 'koack/bot';

const loggerMiddleware = ({ event }, next) => {
  console.log(event);
  next();
};

export default (bot: Bot) => {
  bot.on(
    RTM_EVENTS.CHANNEL_JOINED,
    loggerMiddleware,
    (ctx) => console.log(ctx),
    async (ctx) => Promise.resolve(console.log(ctx)),
  );

  bot.on(
    RTM_EVENTS.MESSAGE,
    messageRouter([
      {
        commands: ['like'], // @mybot like: something
        where: ['dm', 'channel', 'group'], // default to everywhere
        mention: ['channel', 'group'], // default to everywhere except dm
        handler: (ctx) => {},
      },
      {
        commands: ['like'], // @mybot like: something
        middlewares: [
          (ctx) => {},
        ],
      },
      {
        regexp: /hello/,
        handler: (ctx) => {
          ctx.startConversation(async (say, waitResponse) => {
            say('What is your first name ?');
            const firstName = await waitResponse();
            say('And your last name ?');
            const lastName = await waitResponse();
            say(`Hello ${firstName} ${lastName}`);
          });
        }
      },
      {
        handler: (ctx) => ctx.reply('Sorry, I didn\'t understood you'),
      }
    ]),
  );
}
```

### Serving with pool

> pool.js

```js
import { Pool } from 'koack';
import memoryStorage from 'koack/storages/memory';

const pool = new Pool({
  size: 100,
  path: require.resolve('./bot.js'),
});

const storage = memoryStorage();

storage.forEach(team => pool.addTeam(team));

const close = async () => {
  await pool.close();
  process.exit(0);
};
process.on('SIGINT', close);
process.on('SIGTERM', close);

```

Note: [with a server](#with-a-server), `teamsIterator` is handled by the storage.

### Serving without pool

> index.js

```js
import { createBot } from 'koack';
import initBot from './bot';

const bot = createBot({ token });
initBot(bot);

const close = async () => {
  await bot.close();
  process.exit(0);
};
process.on('SIGINT', close);
process.on('SIGTERM', close);

```

### Serving with a web server

A server allows:

- to register new apps with slack button
- to handle slash commands
- to handle interactive buttons

```js
import { Pool, Server } from 'koack';
import memoryStorage from 'koack/storages/memory';

const pool = new Pool({ size: 100, path: require.resolve('./bot') });

const server = new Server({
  pool: pool,
  scopes: ['bot'],
  slackClient: { clientID: ..., clientSecret: ... },
  storage: memoryStorage(),
});

server.listen({ port: Number(process.env.PORT) || 3000 });

process.on('SIGINT', () => server.stop());
process.on('SIGTERM', () => server.stop());
```

## How to...

### Extends the context

```js
bot.context.myOwnContextMethod = () => console.log('Hello !');
```

### Use message-events-router

```js
import { RTM_EVENTS, RTM_MESSAGE_SUBTYPES } from 'koack/bot';
import messageEventsRouter from 'koack/message-events-router';

bot.on(
  RTM_EVENTS.MESSAGE,

  messageEventsRouter({
    events: [RTM_MESSAGE_SUBTYPES.CHANNEL_JOIN, RTM_MESSAGE_SUBTYPES.GROUP_JOIN],
    handler: ctx => {

    },
  }),
);
```

### Interactive messages

> server.js

```js
import { Pool, Server } from 'koack';
import interactiveMessage from 'koack/interactive-messages';

const pool = new Pool({ ... });
const server = new Server({ pool, ... });

server.use(interactiveMessage({
  pool,
  url: '/interactive-message', // optional
  token: 'xxxx',
}));
```

> bot.js

```js
import { INTERACTIVE_MESSAGE_REPONSE } from 'koack/interactive-messages';

bot.on(
  INTERACTIVE_MESSAGE_REPONSE,

  (ctx) => {
    ctx.replyEphemeral('text', { replace: false });
    // or
    ctx.reply('text', { replace: false })
  },
);
```

### Dev with HTTPS

For some features like [interactives messages](https://api.slack.com/docs/message-buttons), you need to use https. They are many way to achieve it, here the most simple we know:

- install globally localltunnel with `npm install -g localtunnel`
- start your bot
- bind your localtunnel in another console `lt --port 4321` (put the port you use in your .env file)

_See [localtunnel](https://localtunnel.github.io/www/) for more details_

[npm-image]: https://img.shields.io/npm/v/koack.svg?style=flat-square
[npm-url]: https://npmjs.org/package/koack
[daviddm-image]: https://david-dm.org/koack/koack.svg?style=flat-square
[daviddm-url]: https://david-dm.org/koack/koack
[dependencyci-image]: https://dependencyci.com/github/koack/koack/badge?style=flat-square
[dependencyci-url]: https://dependencyci.com/github/koack/koack
[circleci-status-image]: https://img.shields.io/circleci/project/koack/koack/master.svg?style=flat-square
[circleci-status-url]: https://circleci.com/gh/koack/koack
[travisci-status-image]: https://img.shields.io/travis/koack/koack/master.svg?style=flat-square
[travisci-status-url]: https://travis-ci.org/koack/koack
[coverage-image]: https://img.shields.io/codecov/c/github/koack/koack/master.svg?style=flat-square
[coverage-url]: https://codecov.io/gh/koack/koack
[docs-coverage-url]: https://koack.github.io/koack/coverage/lcov-report/
