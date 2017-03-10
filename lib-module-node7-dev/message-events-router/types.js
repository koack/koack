import { WhereType as _WhereType } from '../types';

import t from 'flow-runtime';
const WhereType = t.tdz(() => _WhereType);
export const EventHandlerType = t.type('EventHandlerType', t.exactObject(t.property('events', t.array(t.string())), t.property('where', t.nullable(t.array(t.ref(WhereType)))), t.property('handler', t.nullable(t.function())), t.property('middlewares', t.nullable(t.array(t.function())))));

export const MessageEventType = t.type('MessageEventType', t.exactObject(t.property('ts', t.string()), t.property('teamId', t.any()), t.property('userId', t.any()), t.property('channelId', t.any())));
//# sourceMappingURL=types.js.map