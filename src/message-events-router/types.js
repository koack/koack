import type { WhereType } from '../types';

export type EventHandlerType = {|
  events: Array<string>,
  where: ?Array<WhereType>,
  handler: ?Function,
  middlewares: ?Array<Function>
|};

export type MessageEventType = {|
  ts: string,
  teamId: any,
  userId: any,
  channelId: any,
|};
