'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _nodeFetch = require('node-fetch');

var _nodeFetch2 = _interopRequireDefault(_nodeFetch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const extractIdFromHttp = key => event => {
  if (typeof event[key] === 'string') {
    return event[key];
  }
  if (typeof event[key] === 'object') {
    return event[key].id;
  }

  return null;
};

const extrackUserIdFromHttp = extractIdFromHttp('user');
const extrackChannelIdFromHttp = extractIdFromHttp('channel');

exports.default = (botContext, data) => {
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

  return Object.assign(ctx, {
    data,
    actions: data.actions,
    reply(text, { replace = false } = {}) {
      return (0, _nodeFetch2.default)(this.data.responseUrl, { method: 'POST',
        body: JSON.stringify({
          // eslint-disable-next-line camelcase
          replace_original: replace,
          text
        }) }).then(res => res.json());
    },
    replyEphemeral(text, { replace = false } = {}) {
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
  });
};
//# sourceMappingURL=createContextFromInteractiveMessageResponse.js.map