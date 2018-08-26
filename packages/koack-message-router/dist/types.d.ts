import { WhereType } from 'koack-types';
import { Middleware } from 'koa-compose';
export interface Message {
    ts: string;
    text: string;
    teamId: any;
    userId: any;
    channelId: any;
}
declare type Handler = (ctx: Message) => void;
export interface Action {
    commands?: Array<string>;
    where?: Array<WhereType>;
    regexp?: RegExp;
    stop?: boolean;
    mention?: false | Array<WhereType>;
    handler?: Handler;
    middlewares?: Array<Middleware<Message>>;
}
export {};
//# sourceMappingURL=types.d.ts.map