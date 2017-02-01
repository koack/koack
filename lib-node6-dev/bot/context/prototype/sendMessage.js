'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SendMessageOptionsType = undefined;

var _tcombForked = require('tcomb-forked');

var _tcombForked2 = _interopRequireDefault(_tcombForked);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable camelcase */
const ParseType = _tcombForked2.default.enums.of(['none', 'full'], 'ParseType');

const AuthorType = _tcombForked2.default.interface({
  name: _tcombForked2.default.maybe(_tcombForked2.default.String),
  link: _tcombForked2.default.maybe(_tcombForked2.default.String),
  icon: _tcombForked2.default.maybe(_tcombForked2.default.String)
}, {
  name: 'AuthorType',
  strict: true
});

const AttachmentFieldType = _tcombForked2.default.interface({
  title: _tcombForked2.default.String,
  value: _tcombForked2.default.String,
  short: _tcombForked2.default.maybe(_tcombForked2.default.Boolean)
}, {
  name: 'AttachmentFieldType',
  strict: true
});

const AttachmentType = _tcombForked2.default.interface({
  fallback: _tcombForked2.default.String,
  color: _tcombForked2.default.maybe(_tcombForked2.default.String),
  pretext: _tcombForked2.default.maybe(_tcombForked2.default.String),
  author: _tcombForked2.default.maybe(AuthorType),
  title: _tcombForked2.default.maybe(_tcombForked2.default.String),
  titleLink: _tcombForked2.default.maybe(_tcombForked2.default.String),
  text: _tcombForked2.default.String,
  fields: _tcombForked2.default.maybe(_tcombForked2.default.list(AttachmentFieldType)),
  imageUrl: _tcombForked2.default.maybe(_tcombForked2.default.String),
  thumbUrl: _tcombForked2.default.maybe(_tcombForked2.default.String),
  footer: _tcombForked2.default.maybe(_tcombForked2.default.String),
  footerIcon: _tcombForked2.default.maybe(_tcombForked2.default.String)
}, {
  name: 'AttachmentType',
  strict: true
});

const SendMessageOptionsType = exports.SendMessageOptionsType = _tcombForked2.default.interface({
  parse: _tcombForked2.default.maybe(ParseType),
  linkNames: _tcombForked2.default.maybe(_tcombForked2.default.Boolean),
  attachments: _tcombForked2.default.maybe(_tcombForked2.default.list(AttachmentType)),
  unfurlLinks: _tcombForked2.default.maybe(_tcombForked2.default.Boolean),
  unfurlMedia: _tcombForked2.default.maybe(_tcombForked2.default.Boolean),
  username: _tcombForked2.default.maybe(_tcombForked2.default.String),
  asUser: _tcombForked2.default.maybe(_tcombForked2.default.Boolean),
  iconUrl: _tcombForked2.default.maybe(_tcombForked2.default.Boolean),
  iconEmoj: _tcombForked2.default.maybe(_tcombForked2.default.Boolean),
  threadTs: _tcombForked2.default.maybe(_tcombForked2.default.String),
  replyBroadcast: _tcombForked2.default.maybe(_tcombForked2.default.Boolean)
}, {
  name: 'SendMessageOptionsType',
  strict: true
});

const transformAttachment = attachment => {
  _assert(attachment, AttachmentType, 'attachment');

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
  _assert(channelId, _tcombForked2.default.String, 'channelId');

  _assert(message, _tcombForked2.default.String, 'message');

  _assert(options, _tcombForked2.default.maybe(SendMessageOptionsType), 'options');

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

function _assert(x, type, name) {
  if (false) {
    _tcombForked2.default.fail = function (message) {
      console.warn(message);
    };
  }

  if (_tcombForked2.default.isType(type) && type.meta.kind !== 'struct') {
    if (!type.is(x)) {
      type(x, [name + ': ' + _tcombForked2.default.getTypeName(type)]);
    }
  } else if (!(x instanceof type)) {
    _tcombForked2.default.fail('Invalid value ' + _tcombForked2.default.stringify(x) + ' supplied to ' + name + ' (expected a ' + _tcombForked2.default.getTypeName(type) + ')');
  }

  return x;
}
//# sourceMappingURL=sendMessage.js.map