import 'nightingale-app-console';
import Pool from 'koack/src/pool';
import Server from 'koack/src/server';
import mongoStorage from 'koack/src/storages/mongo';
import config from '../config';

(async () => {
  const pool = new Pool({
    size: 100,
    path: require.resolve('../hello-bot/bot'),
  });

  const storage = await mongoStorage(process.env.MONGO || 'mongodb://localhost:27017/hello-pool');
  const server = new Server({
    pool,
    scopes: ['bot'],
    slackClient: config.slackClient,
    storage,
  });

  server.listen({ port: process.env.PORT || 3000 });
})();
