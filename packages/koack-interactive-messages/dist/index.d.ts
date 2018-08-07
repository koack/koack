/// <reference types="koa" />
import Pool from 'koack-pool';
import { Context } from 'koa';
export interface Options {
    pool: Pool;
    token: string;
    url?: string;
}
declare const _default: ({ pool, token, url }: Options) => (context: Context, next: () => Promise<any>) => any;
export default _default;
