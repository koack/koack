'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _nodeFetch = require('node-fetch');

var _nodeFetch2 = _interopRequireDefault(_nodeFetch);

var _types = require('../../types');

var _flowRuntime = require('flow-runtime');

var _flowRuntime2 = _interopRequireDefault(_flowRuntime);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const ContextType = _flowRuntime2.default.tdz(() => _types.ContextType);

const EventContextType = _flowRuntime2.default.tdz(() => _types.EventContextType);

const extractIdFromHttp = key => {
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

const extrackUserIdFromHttp = extractIdFromHttp('user');
const extrackChannelIdFromHttp = extractIdFromHttp('channel');

exports.default = function createContextFromInteractiveMessageResponse(botContext, data) {
  let _botContextType = _flowRuntime2.default.ref(ContextType);

  let _dataType = _flowRuntime2.default.object();

  const _returnType = _flowRuntime2.default.return(_flowRuntime2.default.ref(EventContextType));

  _flowRuntime2.default.param('botContext', _botContextType).assert(botContext);

  _flowRuntime2.default.param('data', _dataType).assert(data);

  const ctx = Object.create(botContext);

  /*
    const data = {
      actions,
      callbackId,
      team,
      channel,
      user,
      actionTs,
      messageTs,
      attachmentId,
      originalMessage,
      responseUrl,
    };
  */

  return _returnType.assert(Object.assign(ctx, {
    data,
    actions: data.actions,
    reply(text, { replace = false } = {}) {
      let _textType = _flowRuntime2.default.string();

      _flowRuntime2.default.param('text', _textType).assert(text);

      return (0, _nodeFetch2.default)(this.data.responseUrl, { method: 'POST',
        body: JSON.stringify({
          // eslint-disable-next-line camelcase
          replace_original: replace,
          text
        }) }).then(res => res.json());
    },
    replyEphemeral(text, { replace = false } = {}) {
      let _textType2 = _flowRuntime2.default.string();

      _flowRuntime2.default.param('text', _textType2).assert(text);

      return (0, _nodeFetch2.default)(this.data.responseUrl, { method: 'POST',
        body: JSON.stringify({
          // eslint-disable-next-line camelcase
          response_type: 'ephemeral',
          // eslint-disable-next-line camelcase
          replace_original: replace,
          text
        }) }).then(res => res.json());
    },
    userId: extrackUserIdFromHttp(data),
    channelId: extrackChannelIdFromHttp(data),
    logger: ctx.logger.context({ callbackId: data.callbackId, actions: data.actions })
  }));
};
//# sourceMappingURL=createContextFromInteractiveMessageResponse.js.map