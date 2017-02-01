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
    username: options.username,
    as_user: options.asUser,
    icon_url: options.iconUrl,
    icon_emoji: options.iconEmoj,
    thread_ts: options.threadTs,
    reply_broadcast: options.replyBroadcast,
  });
};
