import route from 'koa-route';
import parse from 'co-body/lib/form';
import { INTERACTIVE_MESSAGE_RESPONSE } from 'koack-core';

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
    name: INTERACTIVE_MESSAGE_RESPONSE.toString(),
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

export default index;
//# sourceMappingURL=index-node8.es.js.map
