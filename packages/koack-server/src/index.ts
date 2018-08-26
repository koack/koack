import Koa from 'koa';
import route from 'koa-route';
import alplisten from 'alp-listen';
import Pool from 'koack-pool';
// import bodyParser from 'koa-bodyparser';
import { Storage, Team } from 'koack-types';
import createSlackActions from './slack';

export type Handler = (this: Koa.Context, ctx: Koa.Context, ...params: any[]) => any;

type Handler = (this: Koa.Context, ctx: Koa.Context, ...params: any[]) => any;export interface SlackClientConfig {
  clientID: string;
  clientSecret: string;
}

export interface SlackServerConfig {
  slackClient: SlackClientConfig;
  pool: Pool;
  storage: Storage;
  scopes: Array<string>;
  callbackUrl?: string;
  redirectUrl?: string;
}

interface ListenConfigType {
  tls?: boolean;
  socketPath?: string;
  port?: number;
  hostname?: string;
}

export default class SlackServer extends Koa {
  pool: Pool;
  storage: Storage;

  constructor({
    pool,
    storage,
    slackClient,
    scopes,
    callbackUrl = '/callback',
    redirectUrl = '/success',
  }: SlackServerConfig) {
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
        const team: Team = await this.storage.installedTeam(installInfo);
        this.pool.addTeam(team);
        this.emit('installed', installInfo);
      },
    });

    this.registerGet('/', slackActions.authorize);
    this.registerGet(callbackUrl, slackActions.callback);
  }

  registerGet(url: string, callback: Handler) {
    this.use(route.get(url, callback));
  }

  registerPost(url: string, callback: Handler) {
    this.use(route.post(url, callback));
  }

  listen(config: ListenConfigType, certificatesDirname?: string) {
    this.config = new Map(Object.keys(config).map(key => [key, config[key]]));
    alplisten(certificatesDirname)(this);
    this.storage.forEach((team: Team) => this.pool.addTeam(team));
  }

  stop() {
    return this.pool.close();
  }
}
