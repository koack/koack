'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _types = require('../types');

var _flowRuntime = require('flow-runtime');

var _flowRuntime2 = _interopRequireDefault(_flowRuntime);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const EventContextType = _flowRuntime2.default.tdz(() => _types.EventContextType);

const ContextType = _flowRuntime2.default.tdz(() => _types.ContextType);

const extractIdFromEvent = key => {
  let _keyType = _flowRuntime2.default.string();

  _flowRuntime2.default.param('key', _keyType).assert(key);

  return event => {
    let _eventType = _flowRuntime2.default.object();

    _flowRuntime2.default.param('event', _eventType).assert(event);

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

exports.default = function createContextFromEvent(botContext, event) {
  let _botContextType = _flowRuntime2.default.ref(ContextType);

  let _eventType2 = _flowRuntime2.default.object();

  const _returnType = _flowRuntime2.default.return(_flowRuntime2.default.ref(EventContextType));

  _flowRuntime2.default.param('botContext', _botContextType).assert(botContext);

  _flowRuntime2.default.param('event', _eventType2).assert(event);

  const ctx = Object.create(botContext);

  return _returnType.assert(Object.assign(ctx, {
    event,
    userId: extrackUserIdFromEvent(event),
    channelId: extrackChannelIdFromEvent(event),
    logger: ctx.logger.context({ text: event.text })
  }));
};
//# sourceMappingURL=createContextFromEvent.js.map