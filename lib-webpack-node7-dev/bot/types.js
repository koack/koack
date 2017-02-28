import { RtmClient, WebClient } from '@slack/client';
import Logger from 'nightingale-logger';
// import Bot from './Bot';

// export type ContextType<EventType> = {
import t from 'flow-runtime';
export const ContextType = t.type('ContextType', t.object(t.property('rtm', t.ref(RtmClient)), t.property('webClient', t.ref(WebClient)), t.property('logger', t.ref(Logger)), t.property('teamId', t.nullable(t.any())), t.property('userId', t.nullable(t.any())), t.property('channelId', t.nullable(t.any()))));

export const EventContextType = t.type('EventContextType', t.object(t.property('event', t.object())));

export const NextCallbackType = t.type('NextCallbackType', t.function(t.return(t.object())));

export const MiddlewareType = t.type('MiddlewareType', t.function(t.param('ctx', ContextType), t.param('next', NextCallbackType), t.return(t.object())));
//# sourceMappingURL=types.js.map