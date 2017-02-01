/* @flow */
import { RtmClient, WebClient } from '@slack/client';
import Logger from 'nightingale-logger/src';
// import Bot from './Bot';

// export type ContextType<EventType> = {
export type ContextType = {
  // bot: Bot,
  rtm: RtmClient,
  webClient: WebClient,
  logger: Logger,
  teamId: ?any,
  userId: ?any,
  channelId: ?any,
};

export type EventContextType = {
  // event: EventType,
  event: Object,
};

export type NextCallbackType = () => {};

export type MiddlewareType = (ctx: ContextType, next: NextCallbackType) => {};
