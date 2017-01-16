import 'nightingale-app-console';
import Pool from 'koack/src/pool';
import Server from 'koack/src/server';
import memoryStorage from 'koack/src/storages/memory';
import config from '../config';

const pool = new Pool({
  size: 100,
  path: require.resolve('../hello-bot/bot'),
});

const server = new Server({
  pool,
  scopes: ['bot'],
  slackClient: config.slackClient,
  storage: memoryStorage(),
});

server.listen({ port: process.env.PORT || 3000 });
