import { WhereType as _WhereType } from '../types';

import t from 'flow-runtime';
const WhereType = t.tdz(() => _WhereType);
export const ActionType = t.type('ActionType', t.exactObject(t.property('commands', t.nullable(t.array(t.string()))), t.property('where', t.nullable(t.array(t.ref(WhereType)))), t.property('regexp', t.nullable(t.ref('RegExp'))), t.property('stop', t.nullable(t.boolean())), t.property('mention', t.union(t.nullable(t.boolean(false)), t.array(t.ref(WhereType)))), t.property('handler', t.nullable(t.function())), t.property('middlewares', t.nullable(t.array(t.function())))));

export const MessageType = t.type('MessageType', t.exactObject(t.property('ts', t.string()), t.property('text', t.string()), t.property('teamId', t.any()), t.property('userId', t.any()), t.property('channelId', t.any())));
//# sourceMappingURL=types.js.map