import { ChannelType } from 'koack-types';
import { Middleware } from 'koa-compose';

export interface Message {
  ts: string;
  text: string;
  teamId: any;
  userId: any;
  channelId: any;
}

export interface MessageContext {
  message: Message,
}


export type Handler = (ctx: MessageContext) => void;

export interface BaseAction {
  commands?: Array<string>;
  where?: Array<ChannelType>;
  regexp?: RegExp;
  stop?: boolean; // default true
  mention?: false | Array<ChannelType>;
  middlewares?: Array<Middleware<MessageContext>>;
}

export interface ActionWithHandler extends BaseAction {
  handler: Handler;
}

export interface ActionWithMiddlewares extends BaseAction {
  middlewares: Array<Middleware<MessageContext>>;
}

export type Action = ActionWithHandler | ActionWithMiddlewares;
