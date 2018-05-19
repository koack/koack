import fetch from 'node-fetch';


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

export default ((botContext, data) => {
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
      return fetch(this.data.responseUrl, { method: 'POST',
        body: JSON.stringify({
          // eslint-disable-next-line camelcase
          replace_original: replace,
          text
        }) }).then(res => res.json());
    },
    replyEphemeral(text, { replace = false } = {}) {
      return fetch(this.data.responseUrl, { method: 'POST',
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
});
//# sourceMappingURL=createContextFromInteractiveMessageResponse.js.map