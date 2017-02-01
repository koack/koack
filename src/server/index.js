/* @flow */
import Koa from 'koa';
import route from 'koa-route';
import alplisten from 'alp-listen/src';
import object2map from 'object2map';
import Pool from '../../src/pool';
// import bodyParser from 'koa-bodyparser';
import createSlackActions from './slack';
import type { StorageType, TeamType } from '../types/index';

type SlackClientConfigType = {|
  clientID: string,
  clientSecret: string,
|};

type SlackServerConfigType = {|
  slackClient: SlackClientConfigType,
  pool: Pool,
  storage: StorageType,
  scopes: Array<string>,
  callbackUrl: ?string,
  redirectUrl: ?string,
|};

type ListenConfigType = {|
  tls: ?boolean,
  socketPath: ?string,
  port: ?number,
  hostname: ?string,
|};

export default class SlackServer extends Koa {
  pool: Pool;
  storage: StorageType;

  constructor({
    pool,
    storage,
    slackClient,
    scopes,
    callbackUrl = '/callback',
    redirectUrl = '/success',
  }: SlackServerConfigType) {
    super();
    this.pool = pool;
    this.storage = storage;
    // this.use(bodyParser());

    const slackActions = createSlackActions({
      client: slackClient,
      scopes,
      callbackUrl,
      redirectUrl,
      callback: async (installInfo) => {
        const team: TeamType = await this.storage.installedTeam(installInfo);
        this.pool.addTeam(team);
        this.emit('installed', installInfo);
      },
    });

    this.registerGet('/', slackActions.authorize);
    this.registerGet(callbackUrl, slackActions.callback);
  }

  registerGet(url: string, callback: Function) {
    this.use(route.get(url, callback));
  }

  registerPost(url: string, callback: Function) {
    this.use(route.post(url, callback));
  }

  listen(config: ListenConfigType, certificatesDirname: ?string) {
    this.config = object2map(config);
    alplisten(certificatesDirname)(this);
    this.storage.forEach((team: TeamType) => this.pool.addTeam(team));
  }

  stop() {
    return this.pool.close();
  }
}
