import { Context } from '../../types';

/* eslint-disable camelcase */
export type ParseType = 'none' | 'full';

export interface Author {
  name?: string;
  link?: string;
  icon?: string;
}

export interface AttachmentField {
  title: string;
  value: string;
  short?: boolean;
}

export interface AttachmentActionConfirm {
  title: string;
  text: string;
  okText: string;
  dismissText: string;
}

export interface AttachmentAction {
  name: string;
  text: string;
  type: string;
  value: string;
  confirm?: AttachmentActionConfirm;
}

export interface Attachment {
  fallback: string;
  color?: string;
  pretext?: string;
  author?: Author;
  title?: string;
  titleLink?: string;
  text: string;
  fields?: Array<AttachmentField>;
  imageUrl?: string;
  thumbUrl?: string;
  footer?: string;
  footerIcon?: string;
  // interactive message
  callbackId?: string;
  actions?: Array<AttachmentAction>;
}

export interface SendMessageOptions {
  parse?: ParseType;
  linkNames?: boolean;
  attachments?: Array<Attachment>;
  unfurlLinks?: boolean;
  unfurlMedia?: boolean;
  username?: string;
  asUser?: boolean;
  iconUrl?: string;
  iconEmoj?: string;
  threadTs?: string;
  replyBroadcast?: boolean;
}

const transformAttachmentAction = (action: AttachmentAction) => ({
  name: action.name,
  text: action.text,
  type: action.type,
  value: action.value,
  confirm: action.confirm && {
    title: action.confirm.title,
    text: action.confirm.text,
    ok_text: action.confirm.okText,
    dismiss_text: action.confirm.dismissText,
  },
});

const transformAttachment = (attachment: Attachment) => ({
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

export interface MessageResult {
  ts: string;
  replyTo?: number;
}

export default async (
  ctx: Context,
  channelId: string,
  message: string,
  options?: SendMessageOptions,
): Promise<MessageResult> => {
  if (!options) {
    const result = await ctx.rtm.sendMessage(message, channelId);

    if (result.error) {
      throw new Error(result.error.msg);
    }

    return {
      ts: result.ts,
      replyTo: result.reply_to,
    };
  }

  // https://api.slack.com/methods/chat.postMessage#response
  const result: any = await ctx.webClient.chat.postMessage({
    channel: channelId,
    text: message,
    parse: options.parse,
    link_names: options.linkNames,
    attachments: options.attachments && options.attachments.map(transformAttachment),
    unfurl_links: options.unfurlLinks,
    unfurl_media: options.unfurlMedia,
    username: options.username || ctx.bot.name,
    as_user: options.asUser,
    icon_url: options.iconUrl,
    icon_emoji: options.iconEmoj,
    thread_ts: options.threadTs,
    reply_broadcast: options.replyBroadcast,
  });

  if (result.error) {
    throw new Error(result.error);
  }

  return {
    ts: result.ts,
  };
};
