import Koa from 'koa';
import _ from 'koa-route';
import alplisten from 'alp-listen';
import object2map from 'object2map';
import Pool from '../../src/pool';
// import bodyParser from 'koa-bodyparser';
import createSlackActions from './slack';
import type { InstallInfoType, TeamType } from '../types/index';

type SlackClientConfigType = {|
  clientID: string,
  clientSecret: string,
|};

type SlackServerConfigType = {|
  slackClient: SlackClientConfigType,
  pool: Pool,
  scopes: Array<string>,
|};

type ListenConfigType = {|
  tls: ?boolean,
  socketPath: ?string,
  port: ?number,
  hostname: ?string,
|};

const createTeam = (installInfo: InstallInfoType): TeamType => ({
  ...installInfo.team,
  bot: installInfo.bot,
  installations: [
    { user: installInfo.user, date: installInfo.date, scopes: installInfo.scopes },
  ],
});

export default class SlackServer extends Koa {
  constructor(config: SlackServerConfigType) {
    super();
    Object.assign(this, config);
    // this.use(bodyParser());

    const slackActions = createSlackActions({
      client: config.slackClient,
      scopes: config.scopes,
      callbackUrl: '/callback',
      successUrl: '/success',
      callback: (installInfo) => {
        this.pool.addTeam(createTeam(installInfo));
        this.installSuccess(installInfo);
      },
    });

    this.use(_.get('/', slackActions.authorize));
    this.use(_.get('/callback', slackActions.callback));
    this.use(_.get('/success', ctx => ctx.body = 'Youhou !!!'));
  }

  installSuccess() {
  }

  listen(config: ListenConfigType, certificatesDirname: ?string) {
    this.config = object2map(config);
    alplisten(certificatesDirname)(this);
  }
}
