import 'nightingale-app-console';
import Pool from 'koack/src/pool';
import Server from 'koack/src/server';
import mongoStorage from 'koack/src/mongo-storage';
import config from '../config';

const pool = new Pool({
  size: 100,
  path: require.resolve('../hello-bot/bot'),
});

const server = new Server({
  pool,
  scopes: ['bot'],
  slackClient: config.slackClient,
});

mongoStorage(server, process.env.MONGO || 'mongodb://localhost:27017/hello-pool');

server.listen({ port: process.env.PORT || 3000 });
