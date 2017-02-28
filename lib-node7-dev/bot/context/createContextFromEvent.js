'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Bot = require('../Bot');

var _Bot2 = _interopRequireDefault(_Bot);

var _createContextFromBot = require('./createContextFromBot');

var _createContextFromBot2 = _interopRequireDefault(_createContextFromBot);

var _types = require('../types');

var _flowRuntime = require('flow-runtime');

var _flowRuntime2 = _interopRequireDefault(_flowRuntime);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const EventContextType = _flowRuntime2.default.tdz(() => _types.EventContextType);

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

exports.default = function createContextFromEvent(bot, event) {
  let _botType = _flowRuntime2.default.ref(_Bot2.default);

  let _eventType2 = _flowRuntime2.default.object();

  const _returnType = _flowRuntime2.default.return(_flowRuntime2.default.ref(EventContextType));

  _flowRuntime2.default.param('bot', _botType).assert(bot);

  _flowRuntime2.default.param('event', _eventType2).assert(event);

  const ctx = (0, _createContextFromBot2.default)(bot);

  Object.assign(ctx, {
    event,
    userId: extrackUserIdFromEvent(event),
    channelId: extrackChannelIdFromEvent(event)
  });

  ctx.logger.extendsContext({
    text: event.text
  });

  return _returnType.assert(ctx);
};
//# sourceMappingURL=createContextFromEvent.js.map