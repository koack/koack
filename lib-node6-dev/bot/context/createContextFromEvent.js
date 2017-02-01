'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _arguments = arguments;

var _tcombForked = require('tcomb-forked');

var _tcombForked2 = _interopRequireDefault(_tcombForked);

var _Bot = require('../Bot');

var _Bot2 = _interopRequireDefault(_Bot);

var _createContextFromBot = require('./createContextFromBot');

var _createContextFromBot2 = _interopRequireDefault(_createContextFromBot);

var _types = require('../types');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const extractIdFromEvent = key => {
  _assert(key, _tcombForked2.default.String, 'key');

  return event => {
    _assert(event, _tcombForked2.default.Object, 'event');

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

exports.default = function createContextFromEvent(bot, event) {
  _assert(bot, _Bot2.default, 'bot');

  _assert(event, _tcombForked2.default.Object, 'event');

  return _assert(function () {
    const ctx = (0, _createContextFromBot2.default)(bot);

    Object.assign(ctx, {
      event,
      userId: extrackUserIdFromEvent(event),
      channelId: extrackChannelIdFromEvent(event)
    });

    ctx.logger.extendsContext({
      text: event.text
    });

    return ctx;
  }.apply(undefined, _arguments), _types.EventContextType, 'return value');
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
//# sourceMappingURL=createContextFromEvent.js.map