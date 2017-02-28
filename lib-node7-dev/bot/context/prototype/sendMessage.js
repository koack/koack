'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SendMessageOptionsType = undefined;

var _flowRuntime = require('flow-runtime');

var _flowRuntime2 = _interopRequireDefault(_flowRuntime);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable camelcase */
const ParseType = _flowRuntime2.default.type('ParseType', _flowRuntime2.default.union(_flowRuntime2.default.string('none'), _flowRuntime2.default.string('full')));

const AuthorType = _flowRuntime2.default.type('AuthorType', _flowRuntime2.default.exactObject(_flowRuntime2.default.property('name', _flowRuntime2.default.nullable(_flowRuntime2.default.string())), _flowRuntime2.default.property('link', _flowRuntime2.default.nullable(_flowRuntime2.default.string())), _flowRuntime2.default.property('icon', _flowRuntime2.default.nullable(_flowRuntime2.default.string()))));

const AttachmentFieldType = _flowRuntime2.default.type('AttachmentFieldType', _flowRuntime2.default.exactObject(_flowRuntime2.default.property('title', _flowRuntime2.default.string()), _flowRuntime2.default.property('value', _flowRuntime2.default.string()), _flowRuntime2.default.property('short', _flowRuntime2.default.nullable(_flowRuntime2.default.boolean()))));

const AttachmentType = _flowRuntime2.default.type('AttachmentType', _flowRuntime2.default.exactObject(_flowRuntime2.default.property('fallback', _flowRuntime2.default.string()), _flowRuntime2.default.property('color', _flowRuntime2.default.nullable(_flowRuntime2.default.string())), _flowRuntime2.default.property('pretext', _flowRuntime2.default.nullable(_flowRuntime2.default.string())), _flowRuntime2.default.property('author', _flowRuntime2.default.nullable(AuthorType)), _flowRuntime2.default.property('title', _flowRuntime2.default.nullable(_flowRuntime2.default.string())), _flowRuntime2.default.property('titleLink', _flowRuntime2.default.nullable(_flowRuntime2.default.string())), _flowRuntime2.default.property('text', _flowRuntime2.default.string()), _flowRuntime2.default.property('fields', _flowRuntime2.default.nullable(_flowRuntime2.default.array(AttachmentFieldType))), _flowRuntime2.default.property('imageUrl', _flowRuntime2.default.nullable(_flowRuntime2.default.string())), _flowRuntime2.default.property('thumbUrl', _flowRuntime2.default.nullable(_flowRuntime2.default.string())), _flowRuntime2.default.property('footer', _flowRuntime2.default.nullable(_flowRuntime2.default.string())), _flowRuntime2.default.property('footerIcon', _flowRuntime2.default.nullable(_flowRuntime2.default.string()))));

const SendMessageOptionsType = exports.SendMessageOptionsType = _flowRuntime2.default.type('SendMessageOptionsType', _flowRuntime2.default.exactObject(_flowRuntime2.default.property('parse', _flowRuntime2.default.nullable(ParseType)), _flowRuntime2.default.property('linkNames', _flowRuntime2.default.nullable(_flowRuntime2.default.boolean())), _flowRuntime2.default.property('attachments', _flowRuntime2.default.nullable(_flowRuntime2.default.array(AttachmentType))), _flowRuntime2.default.property('unfurlLinks', _flowRuntime2.default.nullable(_flowRuntime2.default.boolean())), _flowRuntime2.default.property('unfurlMedia', _flowRuntime2.default.nullable(_flowRuntime2.default.boolean())), _flowRuntime2.default.property('username', _flowRuntime2.default.nullable(_flowRuntime2.default.string())), _flowRuntime2.default.property('asUser', _flowRuntime2.default.nullable(_flowRuntime2.default.boolean())), _flowRuntime2.default.property('iconUrl', _flowRuntime2.default.nullable(_flowRuntime2.default.boolean())), _flowRuntime2.default.property('iconEmoj', _flowRuntime2.default.nullable(_flowRuntime2.default.boolean())), _flowRuntime2.default.property('threadTs', _flowRuntime2.default.nullable(_flowRuntime2.default.string())), _flowRuntime2.default.property('replyBroadcast', _flowRuntime2.default.nullable(_flowRuntime2.default.boolean()))));

const transformAttachment = attachment => {
  _flowRuntime2.default.param('attachment', AttachmentType).assert(attachment);

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

exports.default = function sendMessage(ctx, channelId, message, options) {
  let _channelIdType = _flowRuntime2.default.string();

  let _messageType = _flowRuntime2.default.string();

  let _optionsType = _flowRuntime2.default.nullable(SendMessageOptionsType);

  _flowRuntime2.default.param('channelId', _channelIdType).assert(channelId);

  _flowRuntime2.default.param('message', _messageType).assert(message);

  _flowRuntime2.default.param('options', _optionsType).assert(options);

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
};
//# sourceMappingURL=sendMessage.js.map