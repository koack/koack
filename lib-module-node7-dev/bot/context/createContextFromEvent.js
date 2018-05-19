import { EventContextType as _EventContextType, ContextType as _ContextType } from '../types';

import t from 'flow-runtime';
const EventContextType = t.tdz(() => _EventContextType);
const ContextType = t.tdz(() => _ContextType);
const extractIdFromEvent = key => {
  let _keyType = t.string();

  t.param('key', _keyType).assert(key);
  return event => {
    let _eventType = t.object();

    t.param('event', _eventType).assert(event);

    if (typeof event[key] === 'string') {
      return event[key];
    }
    if (typeof event[key] === 'object') {
      return event[key].id;
    }

    return null;
  };
};

const extrackUserIdFromEvent = extractIdFromEvent('user');
const extrackChannelIdFromEvent = extractIdFromEvent('channel');

export default (function createContextFromEvent(botContext, event) {
  let _botContextType = t.ref(ContextType);

  let _eventType2 = t.object();

  const _returnType = t.return(t.ref(EventContextType));

  t.param('botContext', _botContextType).assert(botContext);
  t.param('event', _eventType2).assert(event);

  const ctx = Object.create(botContext);

  return _returnType.assert(Object.assign(ctx, {
    event,
    userId: extrackUserIdFromEvent(event),
    channelId: extrackChannelIdFromEvent(event),
    logger: ctx.logger.context({ text: event.text })
  }));
});
//# sourceMappingURL=createContextFromEvent.js.map