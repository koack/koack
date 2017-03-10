import compose from 'koa-compose';
import { EventHandlerType as _EventHandlerType } from './types';

import t from 'flow-runtime';
const EventHandlerType = t.tdz(() => _EventHandlerType);
const EventHandlerMapType = t.type('EventHandlerMapType', t.object(t.property('dm', t.ref('Map', t.string(), t.ref(EventHandlerType))), t.property('channel', t.ref('Map', t.string(), t.ref(EventHandlerType))), t.property('group', t.ref('Map', t.string(), t.ref(EventHandlerType)))));


export default (function createEventHandlersMap(actions) {
  let _actionsType = t.array(t.ref(EventHandlerType));

  const _returnType = t.return(EventHandlerMapType);

  t.param('actions', _actionsType).assert(actions);

  const map = {
    dm: new Map(),
    channel: new Map(),
    group: new Map()
  };

  actions.forEach(eventHandler => {
    let _eventHandlerType = t.ref(EventHandlerType);

    t.param('eventHandler', _eventHandlerType).assert(eventHandler);

    if (!eventHandler.where) eventHandler.where = ['dm', 'channel', 'group'];
    if (!eventHandler.handler) eventHandler.handler = compose(eventHandler.middlewares);

    eventHandler.where.forEach(where => {
      eventHandler.events.forEach(eventName => {
        let _eventNameType = t.string();

        t.param('eventName', _eventNameType).assert(eventName);

        if (map[where].has(eventName)) throw new Error(`event redefined: "${eventName}"`);
        map[where].set(eventName, eventHandler);
      });
    });
  });

  return _returnType.assert(map);
});
//# sourceMappingURL=createEventHandlersMap.js.map