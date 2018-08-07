import { CallbackEventHandler, EventHandler } from './types';
export interface EventHandlerMap {
    [key: string]: Map<string, CallbackEventHandler>;
}
declare const _default: (actions: EventHandler[]) => EventHandlerMap;
export default _default;
//# sourceMappingURL=createEventHandlersMap.d.ts.map