import Koa from 'koa';
import route from 'koa-route';
import alplisten from 'alp-listen';
import object2map from 'object2map';

// import bodyParser from 'koa-bodyparser';
import createSlackActions from './slack';


export default class SlackServer extends Koa {

  constructor({
    pool,
    storage,
    slackClient,
    scopes,
    callbackUrl = '/callback',
    redirectUrl = '/success'
  }) {
    super();
    this.pool = pool;
    this.storage = storage;
    // this.use(bodyParser());

    const slackActions = createSlackActions({
      client: slackClient,
      scopes,
      callbackUrl,
      redirectUrl,
      callback: async installInfo => {
        const team = await this.storage.installedTeam(installInfo);
        this.pool.addTeam(team);
        this.emit('installed', installInfo);
      }
    });

    this.registerGet('/', slackActions.authorize);
    this.registerGet(callbackUrl, slackActions.callback);
  }

  registerGet(url, callback) {
    this.use(route.get(url, callback));
  }

  registerPost(url, callback) {
    this.use(route.post(url, callback));
  }

  listen(config, certificatesDirname) {
    this.config = object2map(config);
    alplisten(certificatesDirname)(this);
    this.storage.forEach(team => this.pool.addTeam(team));
  }

  stop() {
    return this.pool.close();
  }
}
//# sourceMappingURL=index.js.map