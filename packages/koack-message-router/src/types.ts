import { WhereType } from 'koack-types';

export interface Action {
  commands?: Array<string>;
  where?: Array<WhereType>;
  regexp?: RegExp;
  stop?: boolean; // default true
  mention?: false | Array<WhereType>;
  handler?: Function;
  middlewares?: Array<Function>;
}

export interface Message {
  ts: string;
  text: string;
  teamId: any;
  userId: any;
  channelId: any;
}
