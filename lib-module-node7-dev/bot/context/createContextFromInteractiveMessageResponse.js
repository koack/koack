import fetch from 'node-fetch';
import { ContextType as _ContextType, EventContextType as _EventContextType } from '../../types';

import t from 'flow-runtime';
const ContextType = t.tdz(() => _ContextType);
const EventContextType = t.tdz(() => _EventContextType);
const extractIdFromHttp = key => {
  let _keyType = t.string();

  t.param('key', _keyType).assert(key);
  return event => {
    let _eventType = t.object();

    t.param('event', _eventType).assert(event);

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

export default (function createContextFromInteractiveMessageResponse(botContext, data) {
  let _botContextType = t.ref(ContextType);

  let _dataType = t.object();

  const _returnType = t.return(t.ref(EventContextType));

  t.param('botContext', _botContextType).assert(botContext);
  t.param('data', _dataType).assert(data);

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
      let _textType = t.string();

      t.param('text', _textType).assert(text);

      return fetch(this.data.responseUrl, { method: 'POST',
        body: JSON.stringify({
          // eslint-disable-next-line camelcase
          replace_original: replace,
          text
        }) }).then(res => res.json());
    },
    replyEphemeral(text, { replace = false } = {}) {
      let _textType2 = t.string();

      t.param('text', _textType2).assert(text);

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
  }));
});
//# sourceMappingURL=createContextFromInteractiveMessageResponse.js.map