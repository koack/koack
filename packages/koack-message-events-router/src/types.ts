import { ChannelType } from 'koack-types';
import { Middleware } from 'koa-compose';
import { EventContext } from 'koack-bot/types';

export interface MessageEvent {
  ts: string;
  teamId: any;
  userId: any;
  channelId: any;
}

export interface MessageContext extends EventContext {
  messageEvent: MessageEvent;
}

export interface BaseEventHandler {
  events: Array<string>;
  where?: Array<ChannelType>;
}

export interface CallbackEventHandler extends BaseEventHandler {
  handler: (ctx: MessageContext) => void | Promise<void>;
}

export interface MiddlewaresEventHandler extends BaseEventHandler {
  handler?: undefined;
  middlewares: Array<Middleware<MessageContext>>;
}

export type EventHandler = CallbackEventHandler | MiddlewaresEventHandler;
