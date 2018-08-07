import { InstallInfo } from 'koack-types';
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
    authorize: (ctx: any) => void;
    callback: (ctx: any) => Promise<void>;
};
export default _default;
//# sourceMappingURL=index.d.ts.map