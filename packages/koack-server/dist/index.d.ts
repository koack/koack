import Koa from 'koa';
import Pool from 'koack-pool';
import { Storage } from 'koack-types';
export declare type Handler = (this: Koa.Context, ctx: Koa.Context, ...params: any[]) => any;
declare type Handler = (this: Koa.Context, ctx: Koa.Context, ...params: any[]) => any;
export interface SlackClientConfig {
    clientID: string;
    clientSecret: string;
}
export interface SlackServerConfig {
    slackClient: SlackClientConfig;
    pool: Pool;
    storage: Storage;
    scopes: Array<string>;
    callbackUrl?: string;
    redirectUrl?: string;
}
interface ListenConfigType {
    tls?: boolean;
    socketPath?: string;
    port?: number;
    hostname?: string;
}
export default class SlackServer extends Koa {
    pool: Pool;
    storage: Storage;
    constructor({ pool, storage, slackClient, scopes, callbackUrl, redirectUrl, }: SlackServerConfig);
    registerGet(url: string, callback: Handler): void;
    registerPost(url: string, callback: Handler): void;
    listen(config: ListenConfigType, certificatesDirname?: string): void;
    stop(): any;
}
export {};
//# sourceMappingURL=index.d.ts.map