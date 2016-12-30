import Koa from 'koa';
import _ from 'koa-route';
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
}
