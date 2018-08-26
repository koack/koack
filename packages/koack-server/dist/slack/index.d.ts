import { InstallInfo } from 'koack-types';
import { Context } from 'koa';
interface ClientConfig {
    clientID: string;
    clientSecret: string;
}
interface ArgsType {
    client: ClientConfig;
    scopes: Array<string>;
    callbackUrl: string;
    redirectUrl: string;
    callback: (info: InstallInfo) => void | Promise<void>;
}
declare const _default: ({ client, scopes, callbackUrl, redirectUrl, callback, }: ArgsType) => {
    authorize: (ctx: Context) => void;
    callback: (ctx: Context) => Promise<void>;
};
export default _default;
//# sourceMappingURL=index.d.ts.map