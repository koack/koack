import 'nightingale-app-console';
import Pool from 'koack/src/pool';
import Server from 'koack/src/server';
import memoryStorage from 'koack/src/storages/memory';
import interactiveMessages from 'koack/src/interactive-messages';
import config from '../config';

const pool = new Pool({
  size: 100,
  path: require.resolve('./bot'),
});

const server = new Server({
  pool,
  scopes: ['bot'],
  slackClient: config.slackClient,
  storage: memoryStorage(),
});

server.proxy = true;

server.use(interactiveMessages({
  pool,
  token: config.verificationToken,
}));

server.listen({ port: process.env.PORT || 3000 });
