import Koa from 'koa';
import bodyParser from 'koa-bodyparser';

export default class SlackServer extends Koa {
  constructor(...args) {
    super(...args);
    this.use(bodyParser());
  }

}
