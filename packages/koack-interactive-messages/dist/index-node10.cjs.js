'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var route = _interopDefault(require('koa-route'));
var parse = _interopDefault(require('co-body/lib/form'));
var koackCore = require('koack-core');

var index = (({
  pool,
  token,
  url = '/interactive-message'
}) => route.post(url, async ctx => {
  let {
    payload
  } = await parse(ctx);
  if (!payload) throw new Error('Invalid payload');
  payload = JSON.parse(payload);
  if (payload.token !== token) throw new Error('Invalid token');
  const {
    actions,
    callback_id: callbackId,
    team,
    channel,
    user,
    action_ts: actionTs,
    message_ts: messageTs,
    attachment_id: attachmentId,
    original_message: originalMessage,
    response_url: responseUrl
  } = payload;
  pool.sendBotMessage(team.id, {
    type: 'event',
    name: koackCore.INTERACTIVE_MESSAGE_RESPONSE.toString(),
    data: {
      actions,
      callbackId,
      team,
      channel,
      user,
      actionTs,
      messageTs,
      attachmentId,
      originalMessage,
      responseUrl
    }
  });
}));

exports.default = index;
//# sourceMappingURL=index-node10.cjs.js.map
