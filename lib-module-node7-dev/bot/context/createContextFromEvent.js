import Bot from '../Bot';
import createContextFromBot from './createContextFromBot';
import { EventContextType as _EventContextType } from '../types';

import t from 'flow-runtime';
const EventContextType = t.tdz(() => _EventContextType);
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

export default (function createContextFromEvent(bot, event) {
  let _botType = t.ref(Bot);

  let _eventType2 = t.object();

  const _returnType = t.return(t.ref(EventContextType));

  t.param('bot', _botType).assert(bot);
  t.param('event', _eventType2).assert(event);

  const ctx = createContextFromBot(bot);

  Object.assign(ctx, {
    event,
    userId: extrackUserIdFromEvent(event),
    channelId: extrackChannelIdFromEvent(event)
  });

  ctx.logger.extendsContext({
    text: event.text
  });

  return _returnType.assert(ctx);
});
//# sourceMappingURL=createContextFromEvent.js.map