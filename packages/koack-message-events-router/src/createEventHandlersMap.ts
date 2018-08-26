import compose from 'koa-compose';
import { ChannelType } from 'koack-types';
import { CallbackEventHandler, EventHandler, MiddlewaresEventHandler } from './types';

export interface EventHandlerMap {
  [key: string]: Map<string, CallbackEventHandler>;
}

export default (actions: Array<EventHandler>): EventHandlerMap => {
  const map: EventHandlerMap = {
    dm: new Map(),
    channel: new Map(),
    group: new Map(),
  };

  actions.forEach((eventHandler: EventHandler) => {
    if (!eventHandler.where) eventHandler.where = ['dm', 'channel', 'group'];
    if (eventHandler.handler === undefined) {
      (eventHandler as CallbackEventHandler).handler = compose(
        (eventHandler as MiddlewaresEventHandler).middlewares,
      );
    }

    eventHandler.where.forEach((where: ChannelType) => {
      eventHandler.events.forEach((eventName: string) => {
        if (map[where].has(eventName)) throw new Error(`event redefined: "${eventName}"`);
        map[where].set(eventName, eventHandler as CallbackEventHandler);
      });
    });
  });

  return map;
};
