# koack [![NPM version][npm-image]][npm-url]



[![Build Status][circleci-status-image]][circleci-status-url]
[![Travis Status][travisci-status-image]][travisci-status-url]
[![Dependency ci Status][dependencyci-image]][dependencyci-url]
[![Dependency Status][daviddm-image]][daviddm-url]
[![Coverage percentage][coverage-image]][coverage-url]

## Install

```sh
npm install --save koack
```

## API

[https://christophehurpeau.github.io/koack/docs](http://christophehurpeau.github.io/koack/docs)

## Usage

> bot.js

```js
import { RTM_EVENTS } from 'koack/bot';
import messageRouter from 'koack/message-router';
import type { Bot } from 'koack/types';

const loggerMiddleware = () => ...;

export default (bot: Bot) {
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
        handler: (ctx) => {}
      },
      {
        commands: ['like'], // @mybot like: something
        middlewares: [
          (ctx) => {}
        ],
      },
      {
        regexp: /hello/,
        handler: (ctx) => {
          ctx.startConversation(async (say, waitResponse) => {
            say('What is your first name ?');
            const fistName = await waitResponse();
            say('And your last name ?');
            const lastName = await waitResponse();
            say(`Hello ${firstName} ${lastName}`);
          });
        }
      },
    ]),
    (ctx) => ctx.respond('Sorry, I didn't understood you'),
  );
}
```

## With pool

> pool.js

```js
import { Pool } from 'koack';

const pool = new Pool({
  size: 100,
  path: require.resolve('./bot.js'),
});

pool.start(teamsIterator)
  .then(() => console.log('All teams launched !'));

process.on('SIGINT', () => pool.close());
process.on('SIGTERM', () => pool.close());

```

## Only one bot

> index.js

```js
import { createBot } from 'koack';
import initBot from './bot';

const bot = createBot({ token });
initBot(bot);

process.on('SIGINT', () => bot.close());
process.on('SIGTERM', () => bot.close());
```

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
