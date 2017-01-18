'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _arguments = arguments;

var _tcombForked = require('tcomb-forked');

var _tcombForked2 = _interopRequireDefault(_tcombForked);

var _koaCompose = require('koa-compose');

var _koaCompose2 = _interopRequireDefault(_koaCompose);

var _types = require('./types');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const EventHandlerMapType = _tcombForked2.default.interface({
  dm: Map,
  channel: Map,
  group: Map
}, 'EventHandlerMapType');

exports.default = function createEventHandlersMap(actions) {
  _assert(actions, _tcombForked2.default.list(_types.EventHandlerType), 'actions');

  return _assert(function () {
    const map = {
      dm: new Map(),
      channel: new Map(),
      group: new Map()
    };

    actions.forEach(eventHandler => {
      _assert(eventHandler, _types.EventHandlerType, 'eventHandler');

      if (!eventHandler.where) eventHandler.where = ['dm', 'channel', 'group'];
      if (!eventHandler.handler) eventHandler.handler = (0, _koaCompose2.default)(eventHandler.middlewares);

      eventHandler.where.forEach(where => {
        eventHandler.events.forEach(eventName => {
          _assert(eventName, _tcombForked2.default.String, 'eventName');

          if (map[where].has(eventName)) throw new Error(`event redefined: "${ eventName }"`);
          map[where].set(eventName, eventHandler);
        });
      });
    });

    return map;
  }.apply(undefined, _arguments), EventHandlerMapType, 'return value');
};

function _assert(x, type, name) {
  if (false) {
    _tcombForked2.default.fail = function (message) {
      console.warn(message);
    };
  }

  if (_tcombForked2.default.isType(type) && type.meta.kind !== 'struct') {
    if (!type.is(x)) {
      type(x, [name + ': ' + _tcombForked2.default.getTypeName(type)]);
    }
  } else if (!(x instanceof type)) {
    _tcombForked2.default.fail('Invalid value ' + _tcombForked2.default.stringify(x) + ' supplied to ' + name + ' (expected a ' + _tcombForked2.default.getTypeName(type) + ')');
  }

  return x;
}
//# sourceMappingURL=createEventHandlersMap.js.map