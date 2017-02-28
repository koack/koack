'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _koaCompose = require('koa-compose');

var _koaCompose2 = _interopRequireDefault(_koaCompose);

var _types = require('./types');

var _flowRuntime = require('flow-runtime');

var _flowRuntime2 = _interopRequireDefault(_flowRuntime);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const EventHandlerType = _flowRuntime2.default.tdz(() => _types.EventHandlerType);

const EventHandlerMapType = _flowRuntime2.default.type('EventHandlerMapType', _flowRuntime2.default.object(_flowRuntime2.default.property('dm', _flowRuntime2.default.ref('Map', _flowRuntime2.default.string(), _flowRuntime2.default.ref(EventHandlerType))), _flowRuntime2.default.property('channel', _flowRuntime2.default.ref('Map', _flowRuntime2.default.string(), _flowRuntime2.default.ref(EventHandlerType))), _flowRuntime2.default.property('group', _flowRuntime2.default.ref('Map', _flowRuntime2.default.string(), _flowRuntime2.default.ref(EventHandlerType)))));

exports.default = function createEventHandlersMap(actions) {
  let _actionsType = _flowRuntime2.default.array(_flowRuntime2.default.ref(EventHandlerType));

  const _returnType = _flowRuntime2.default.return(EventHandlerMapType);

  _flowRuntime2.default.param('actions', _actionsType).assert(actions);

  const map = {
    dm: new Map(),
    channel: new Map(),
    group: new Map()
  };

  actions.forEach(eventHandler => {
    let _eventHandlerType = _flowRuntime2.default.ref(EventHandlerType);

    _flowRuntime2.default.param('eventHandler', _eventHandlerType).assert(eventHandler);

    if (!eventHandler.where) eventHandler.where = ['dm', 'channel', 'group'];
    if (!eventHandler.handler) eventHandler.handler = (0, _koaCompose2.default)(eventHandler.middlewares);

    eventHandler.where.forEach(where => {
      eventHandler.events.forEach(eventName => {
        let _eventNameType = _flowRuntime2.default.string();

        _flowRuntime2.default.param('eventName', _eventNameType).assert(eventName);

        if (map[where].has(eventName)) throw new Error(`event redefined: "${eventName}"`);
        map[where].set(eventName, eventHandler);
      });
    });
  });

  return _returnType.assert(map);
};
//# sourceMappingURL=createEventHandlersMap.js.map