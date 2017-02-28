'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _koaCompose = require('koa-compose');

var _koaCompose2 = _interopRequireDefault(_koaCompose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = actions => {
  const map = {
    dm: new Map(),
    channel: new Map(),
    group: new Map()
  };

  actions.forEach(eventHandler => {
    if (!eventHandler.where) eventHandler.where = ['dm', 'channel', 'group'];
    if (!eventHandler.handler) eventHandler.handler = (0, _koaCompose2.default)(eventHandler.middlewares);

    eventHandler.where.forEach(where => {
      eventHandler.events.forEach(eventName => {
        if (map[where].has(eventName)) throw new Error(`event redefined: "${eventName}"`);
        map[where].set(eventName, eventHandler);
      });
    });
  });

  return map;
};
//# sourceMappingURL=createEventHandlersMap.js.map