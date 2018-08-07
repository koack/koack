import route from 'koa-route';
import parse from 'co-body/lib/form';
import { INTERACTIVE_MESSAGE_RESPONSE } from 'koack-core';
import Pool from 'koack-pool';
import { Context } from 'koa';

export interface Options {
  pool: Pool,
  token: string,
  url?: string,
}

export default ({ pool, token, url = '/interactive-message' }: Options) => (
  route.post(url, async (ctx: Context) => {
    let { payload } = await parse(ctx);
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
      response_url: responseUrl,
    } = payload;

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
    pool.sendBotMessage(team.id, { type: 'event', name: INTERACTIVE_MESSAGE_RESPONSE.toString(), data });
  })
);
