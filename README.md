<h3 align="center">
  koack
</h3>

<p align="center">
  Core brick to build Slack bots
</p>

<h1>Packages</h1>

This repository is a monorepo that we manage using [Lerna](https://github.com/lerna/lerna).

| Package | Version | Description |
|---------|---------|-------------|
| [koack](/packages/koack) | <a href="https://npmjs.org/package/koack"><img src="https://img.shields.io/npm/v/koack.svg?style=flat-square"></a> | 
| [koack-bot](/packages/koack-bot) | <a href="https://npmjs.org/package/koack-bot"><img src="https://img.shields.io/npm/v/koack-bot.svg?style=flat-square"></a> | Bot koack
| [koack-core](/packages/koack-core) | <a href="https://npmjs.org/package/koack-core"><img src="https://img.shields.io/npm/v/koack-core.svg?style=flat-square"></a> | 
| [koack-examples](/packages/koack-examples) | <a href="https://npmjs.org/package/koack-examples"><img src="https://img.shields.io/npm/v/koack-examples.svg?style=flat-square"></a> | 
| [koack-interactive-messages](/packages/koack-interactive-messages) | <a href="https://npmjs.org/package/koack-interactive-messages"><img src="https://img.shields.io/npm/v/koack-interactive-messages.svg?style=flat-square"></a> | 
| [koack-message-events-router](/packages/koack-message-events-router) | <a href="https://npmjs.org/package/koack-message-events-router"><img src="https://img.shields.io/npm/v/koack-message-events-router.svg?style=flat-square"></a> | 
| [koack-message-router](/packages/koack-message-router) | <a href="https://npmjs.org/package/koack-message-router"><img src="https://img.shields.io/npm/v/koack-message-router.svg?style=flat-square"></a> | 
| [koack-pool](/packages/koack-pool) | <a href="https://npmjs.org/package/koack-pool"><img src="https://img.shields.io/npm/v/koack-pool.svg?style=flat-square"></a> | 
| [koack-server](/packages/koack-server) | <a href="https://npmjs.org/package/koack-server"><img src="https://img.shields.io/npm/v/koack-server.svg?style=flat-square"></a> | 
| [koack-storage-memory](/packages/koack-storage-memory) | <a href="https://npmjs.org/package/koack-storage-memory"><img src="https://img.shields.io/npm/v/koack-storage-memory.svg?style=flat-square"></a> | 
| [koack-storage-mongo](/packages/koack-storage-mongo) | <a href="https://npmjs.org/package/koack-storage-mongo"><img src="https://img.shields.io/npm/v/koack-storage-mongo.svg?style=flat-square"></a> | 
| [koack-storage-utils](/packages/koack-storage-utils) | <a href="https://npmjs.org/package/koack-storage-utils"><img src="https://img.shields.io/npm/v/koack-storage-utils.svg?style=flat-square"></a> | 
| [koack-symbols](/packages/koack-symbols) | <a href="https://npmjs.org/package/koack-symbols"><img src="https://img.shields.io/npm/v/koack-symbols.svg?style=flat-square"></a> | 
| [koack-types](/packages/koack-types) | <a href="https://npmjs.org/package/koack-types"><img src="https://img.shields.io/npm/v/koack-types.svg?style=flat-square"></a> | 

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
import messageRouter from 'koack/message-router';
import type { Bot } from 'koack/bot';

const loggerMiddleware = ({ event }, next) => {
  console.log(event);
  next();
};

export default (bot: Bot) => {
  bot.on(
    'channel_joined',
    loggerMiddleware,
    (ctx) => console.log(ctx),
    async (ctx) => Promise.resolve(console.log(ctx)),
  );

  bot.on(
    'message',
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
import messageEventsRouter from 'koack/message-events-router';

bot.on(
  'message',

  messageEventsRouter({
    events: ['channel_join', 'group_join'],
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
