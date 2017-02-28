import t from 'flow-runtime';
/* eslint-disable camelcase */
const ParseType = t.type('ParseType', t.union(t.string('none'), t.string('full')));
const AuthorType = t.type('AuthorType', t.exactObject(t.property('name', t.nullable(t.string())), t.property('link', t.nullable(t.string())), t.property('icon', t.nullable(t.string()))));
const AttachmentFieldType = t.type('AttachmentFieldType', t.exactObject(t.property('title', t.string()), t.property('value', t.string()), t.property('short', t.nullable(t.boolean()))));
const AttachmentType = t.type('AttachmentType', t.exactObject(t.property('fallback', t.string()), t.property('color', t.nullable(t.string())), t.property('pretext', t.nullable(t.string())), t.property('author', t.nullable(AuthorType)), t.property('title', t.nullable(t.string())), t.property('titleLink', t.nullable(t.string())), t.property('text', t.string()), t.property('fields', t.nullable(t.array(AttachmentFieldType))), t.property('imageUrl', t.nullable(t.string())), t.property('thumbUrl', t.nullable(t.string())), t.property('footer', t.nullable(t.string())), t.property('footerIcon', t.nullable(t.string()))));


export const SendMessageOptionsType = t.type('SendMessageOptionsType', t.exactObject(t.property('parse', t.nullable(ParseType)), t.property('linkNames', t.nullable(t.boolean())), t.property('attachments', t.nullable(t.array(AttachmentType))), t.property('unfurlLinks', t.nullable(t.boolean())), t.property('unfurlMedia', t.nullable(t.boolean())), t.property('username', t.nullable(t.string())), t.property('asUser', t.nullable(t.boolean())), t.property('iconUrl', t.nullable(t.boolean())), t.property('iconEmoj', t.nullable(t.boolean())), t.property('threadTs', t.nullable(t.string())), t.property('replyBroadcast', t.nullable(t.boolean()))));

const transformAttachment = attachment => {
  t.param('attachment', AttachmentType).assert(attachment);
  return {
    fallback: attachment.fallback,
    color: attachment.color,
    pretext: attachment.pretext,
    author_name: attachment.author && attachment.author.name,
    author_link: attachment.author && attachment.author.link,
    author_icon: attachment.author && attachment.author.icon,
    title: attachment.title,
    title_link: attachment.titleLink,
    fields: attachment.fields,
    image_url: attachment.imageUrl,
    thumb_url: attachment.thumbUrl,
    footer: attachment.footer,
    footer_icon: attachment.footerIcon
  };
};

export default (function sendMessage(ctx, channelId, message, options) {
  let _channelIdType = t.string();

  let _messageType = t.string();

  let _optionsType = t.nullable(SendMessageOptionsType);

  t.param('channelId', _channelIdType).assert(channelId);
  t.param('message', _messageType).assert(message);
  t.param('options', _optionsType).assert(options);

  if (!options) {
    return ctx.rtm.sendMessage(message, channelId);
  }

  return ctx.webClient.chat.postMessage(channelId, message, {
    parse: options.parse,
    link_names: options.linkNames,
    attachments: options.attachments.map(transformAttachment),
    unfurl_links: options.unfurlLinks,
    unfurl_media: options.unfurlMedia,
    username: options.username,
    as_user: options.asUser,
    icon_url: options.iconUrl,
    icon_emoji: options.iconEmoj,
    thread_ts: options.threadTs,
    reply_broadcast: options.replyBroadcast
  });
});
//# sourceMappingURL=sendMessage.js.map