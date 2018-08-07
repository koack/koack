import { Action } from './types';
export interface ActionHandlers {
    commands: Map<string, Action>;
    regexps: Array<Action>;
}
export interface ActionsMap {
    dm: ActionHandlers;
    channel: ActionHandlers;
    group: ActionHandlers;
}
declare const _default: (actions: Action[]) => ActionsMap;
export default _default;
//# sourceMappingURL=createActionHandlersMap.d.ts.map