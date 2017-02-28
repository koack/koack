import Koa from 'koa';
import route from 'koa-route';
import alplisten from 'alp-listen';
import object2map from 'object2map';
import Pool from '../../pool';
// import bodyParser from 'koa-bodyparser';
import createSlackActions from './slack';
import { StorageType as _StorageType, TeamType as _TeamType } from '../types/index';

import t from 'flow-runtime';
const StorageType = t.tdz(() => _StorageType);
const TeamType = t.tdz(() => _TeamType);
const SlackClientConfigType = t.type('SlackClientConfigType', t.exactObject(t.property('clientID', t.string()), t.property('clientSecret', t.string())));
const SlackServerConfigType = t.type('SlackServerConfigType', t.exactObject(t.property('slackClient', SlackClientConfigType), t.property('pool', t.ref(Pool)), t.property('storage', t.ref(StorageType)), t.property('scopes', t.array(t.string())), t.property('callbackUrl', t.nullable(t.string())), t.property('redirectUrl', t.nullable(t.string()))));
const ListenConfigType = t.type('ListenConfigType', t.exactObject(t.property('tls', t.nullable(t.boolean())), t.property('socketPath', t.nullable(t.string())), t.property('port', t.nullable(t.number())), t.property('hostname', t.nullable(t.string()))));


export default class SlackServer extends Koa {

  constructor({
    pool,
    storage,
    slackClient,
    scopes,
    callbackUrl = '/callback',
    redirectUrl = '/success'
  }) {
    t.param('arguments[0]', SlackServerConfigType).assert(arguments[0]);

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
        const team = t.ref(TeamType).assert((await this.storage.installedTeam(installInfo)));
        this.pool.addTeam(team);
        this.emit('installed', installInfo);
      }
    });

    this.registerGet('/', slackActions.authorize);
    this.registerGet(callbackUrl, slackActions.callback);
  }

  registerGet(url, callback) {
    let _urlType = t.string();

    let _callbackType = t.function();

    t.param('url', _urlType).assert(url);
    t.param('callback', _callbackType).assert(callback);

    this.use(route.get(url, callback));
  }

  registerPost(url, callback) {
    let _urlType2 = t.string();

    let _callbackType2 = t.function();

    t.param('url', _urlType2).assert(url);
    t.param('callback', _callbackType2).assert(callback);

    this.use(route.post(url, callback));
  }

  listen(config, certificatesDirname) {
    let _certificatesDirnameType = t.nullable(t.string());

    t.param('config', ListenConfigType).assert(config);
    t.param('certificatesDirname', _certificatesDirnameType).assert(certificatesDirname);

    this.config = object2map(config);
    alplisten(certificatesDirname)(this);
    this.storage.forEach(team => {
      let _teamType = t.ref(TeamType);

      t.param('team', _teamType).assert(team);
      return this.pool.addTeam(team);
    });
  }

  stop() {
    return this.pool.close();
  }
}
//# sourceMappingURL=index.js.map