/* @flow */
import Koa from 'koa';
import _ from 'koa-route';
import alplisten from 'alp-listen';
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
|};

type ListenConfigType = {|
  tls: ?boolean,
  socketPath: ?string,
  port: ?number,
  hostname: ?string,
|};

export default class SlackServer extends Koa {
  slackClient: SlackClientConfigType;
  pool: Pool;
  storage: StorageType;
  scopes: Array<string>;

  constructor(config: SlackServerConfigType) {
    super();
    Object.assign(this, config);
    // this.use(bodyParser());

    const slackActions = createSlackActions({
      client: config.slackClient,
      scopes: config.scopes,
      callbackUrl: '/callback',
      successUrl: '/success',
      callback: async (installInfo) => {
        const team: TeamType = await this.storage.installedTeam(installInfo);
        this.pool.addTeam(team);
        this.emit('installed', installInfo);
      },
    });

    this.use(_.get('/', slackActions.authorize));
    this.use(_.get('/callback', slackActions.callback));
    this.use(_.get('/success', ctx => ctx.body = 'Youhou !!!'));
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
