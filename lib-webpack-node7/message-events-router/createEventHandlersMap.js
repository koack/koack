import compose from 'koa-compose';


export default (actions => {
  const map = {
    dm: new Map(),
    channel: new Map(),
    group: new Map()
  };

  actions.forEach(eventHandler => {
    if (!eventHandler.where) eventHandler.where = ['dm', 'channel', 'group'];
    if (!eventHandler.handler) eventHandler.handler = compose(eventHandler.middlewares);

    eventHandler.where.forEach(where => {
      eventHandler.events.forEach(eventName => {
        if (map[where].has(eventName)) throw new Error(`event redefined: "${eventName}"`);
        map[where].set(eventName, eventHandler);
      });
    });
  });

  return map;
});
//# sourceMappingURL=createEventHandlersMap.js.map