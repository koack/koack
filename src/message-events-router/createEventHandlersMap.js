/* @flow */
import compose from 'koa-compose';
import type { EventHandlerType } from './types';

type EventHandlerMapType = {
  dm: Map<string, EventHandlerType>,
  channel: Map<string, EventHandlerType>,
  group: Map<string, EventHandlerType>,
}

export default (actions: Array<EventHandlerType>): EventHandlerMapType => {
  const map = {
    dm: new Map(),
    channel: new Map(),
    group: new Map(),
  };

  actions.forEach((eventHandler: EventHandlerType) => {
    if (!eventHandler.where) eventHandler.where = ['dm', 'channel', 'group'];
    if (!eventHandler.handler) eventHandler.handler = compose(eventHandler.middlewares);

    eventHandler.where.forEach((where) => {
      eventHandler.events.forEach((eventName: string) => {
        if (map[where].has(eventName)) throw new Error(`event redefined: "${eventName}"`);
        map[where].set(eventName, eventHandler);
      });
    });
  });

  return map;
};
