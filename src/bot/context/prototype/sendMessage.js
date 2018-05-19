/* eslint-disable camelcase */
type ParseType = 'none' | 'full';

type AuthorType = {|
  name: ?string,
  link: ?string,
  icon: ?string,
|};

type AttachmentFieldType = {|
  title: string,
  value: string,
  short: ?boolean,
|};

type AttachmentActionConfirmType = {|
  title: string,
  text: string,
  okText: string,
  dismissText: string,
|};

type AttachmentActionType = {|
  name: string,
  text: string,
  type: string,
  value: string,
  confirm: ?AttachmentActionConfirmType,
|};

type AttachmentType = {|
  fallback: string,
  color: ?string,
  pretext: ?string,
  author: ?AuthorType,
  title: ?string,
  titleLink: ?string,
  text: string,
  fields: ?Array<AttachmentFieldType>,
  imageUrl: ?string,
  thumbUrl: ?string,
  footer: ?string,
  footerIcon: ?string,
  // interactive message
  callbackId: ?string,
  actions: ?Array<AttachmentActionType>,
|};

export type SendMessageOptionsType = {|
  parse: ?ParseType,
  linkNames: ?boolean,
  attachments: ?Array<AttachmentType>,
  unfurlLinks: ?boolean,
  unfurlMedia: ?boolean,
  username: ?string,
  asUser: ?boolean,
  iconUrl: ?boolean,
  iconEmoj: ?boolean,
  threadTs: ?string,
  replyBroadcast: ?boolean,
|};

const transformAttachmentAction = (action: AttachmentActionType) => ({
  name: action.name,
  text: action.text,
  type: action.type,
  value: action.value,
  confirm: action.confirm && ({
    title: action.title,
    text: action.text,
    ok_text: action.okText,
    dismiss_text: action.dismissText,
  }),
});

const transformAttachment = (attachment: AttachmentType) => ({
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
  actions: attachment.actions && attachment.actions.map(transformAttachmentAction),
});

export default (ctx, channelId: string, message: string, options: ?SendMessageOptionsType) => {
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
    reply_broadcast: options.replyBroadcast,
  });
};
