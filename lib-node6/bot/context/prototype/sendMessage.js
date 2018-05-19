'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});


const transformAttachmentAction = action => ({
  name: action.name,
  text: action.text,
  type: action.type,
  value: action.value,
  confirm: action.confirm && {
    title: action.title,
    text: action.text,
    ok_text: action.okText,
    dismiss_text: action.dismissText
  }
}); /* eslint-disable camelcase */


const transformAttachment = attachment => ({
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
  footer_icon: attachment.footerIcon,
  // interactive message
  callback_id: attachment.callbackId,
  actions: attachment.actions && attachment.actions.map(transformAttachmentAction)
});

exports.default = (ctx, channelId, message, options) => {
  if (!options) {
    return ctx.rtm.sendMessage(message, channelId);
  }

  return ctx.webClient.chat.postMessage(channelId, message, {
    parse: options.parse,
    link_names: options.linkNames,
    attachments: options.attachments.map(transformAttachment),
    unfurl_links: options.unfurlLinks,
    unfurl_media: options.unfurlMedia,
    username: options.username || ctx.bot.name,
    as_user: options.asUser,
    icon_url: options.iconUrl,
    icon_emoji: options.iconEmoj,
    thread_ts: options.threadTs,
    reply_broadcast: options.replyBroadcast
  });
};
//# sourceMappingURL=sendMessage.js.map