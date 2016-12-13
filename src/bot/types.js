import { RtmClient, WebClient } from '@slack/client';
import Logger from 'nightingale-logger/src';
// import Bot from './Bot';

// export type ContextType<EventType> = {
export type ContextType = {
  // bot: Bot,
  rtm: RtmClient,
  webClient: WebClient,
  logger: Logger,
  // event: EventType,
  event: Object,
  teamId: ?any,
  userId: ?any,
  channelId: ?any,
};

export type NextCallbackType = () => {};

export type MiddlewareType = (ctx: ContextType, next: NextCallbackType) => {};
