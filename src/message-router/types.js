/* @flow */
import type { WhereType } from '../types';

export type ActionType = {|
  commands: ?Array<string>,
  where: ?Array<WhereType>,
  regexp: ?RegExp,
  stop: ?bool, // default true
  mention: ?false | Array<WhereType>,
  handler: ?Function,
  middlewares: ?Array<Function>
|};

export type MessageType = {|
  ts: string,
  text: string,
  teamId: any,
  userId: any,
  channelId: any,
|};
