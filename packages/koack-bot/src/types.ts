import { RTMClient, WebClient } from '@slack/client';
import Logger from 'nightingale-logger';
import { Team, ChannelType } from 'koack-types';
import Bot from './Bot';
import { SendMessageOptions, MessageResult } from './context/prototype/sendMessage';

export { Team, ChannelType };

// export type Context<Event> = {
export interface BaseContext {
  /* internal */
  _channel: any;
  getChannelType: () => ChannelType;
  user?: any;
  dm?: any;
  userDM?: any;
  teamId?: any;
  fromMe: boolean;
  getChannelInfo(): any;
  getGroupInfo(): any;
  sendMessage(
    channelId: string,
    message: string,
    options?: SendMessageOptions,
  ): Promise<MessageResult>;
  reply(message: string, options?: SendMessageOptions): Promise<MessageResult>;
  replyInDM(message: string, options?: SendMessageOptions): Promise<MessageResult>;
  mention(userId?: string): string;
  isFromMe(): boolean;
}

export interface BotContext extends BaseContext {
  bot: Bot;
  rtm: RTMClient;
  webClient: WebClient;
  logger: Logger;
  team: Team;
}

export interface EventContext extends BotContext {
  // event: Event,
  event: object;
  userId: string;
  channelId: string;
}

export type NextCallback = () => {};

export type BotMiddleware = (ctx: BotContext, next: NextCallback) => {};
