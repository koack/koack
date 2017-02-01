'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _tcombForked = require('tcomb-forked');

var _tcombForked2 = _interopRequireDefault(_tcombForked);

var _sendMessage = require('./prototype/sendMessage');

var _sendMessage2 = _interopRequireDefault(_sendMessage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  getChannelType() {
    switch (this.channelId[0]) {
      case 'D':
        return 'dm';
      case 'C':
        return 'channel';
      case 'G':
        return 'group';
    }
  },

  get user() {
    const user = this.channelId && this.rtm.dataStore.getUserById(this.channelId);
    Object.defineProperty(this, 'user', { value: user });
    return user;
  },

  get dm() {
    const dm = this.channelId && this.rtm.dataStore.getDMById(this.channelId);
    Object.defineProperty(this, 'dm', { value: dm });
    return dm;
  },

  get channel() {
    const channel = this.channelId && this.rtm.dataStore.getChannelById(this.channelId);
    Object.defineProperty(this, 'channel', { value: channel });
    return channel;
  },

  get group() {
    const group = this.channelId && this.rtm.dataStore.getGroupById(this.channelId);
    Object.defineProperty(this, 'group', { value: group });
    return group;
  },

  get userDM() {
    const dm = this.channelId && this.rtm.dataStore.getDMByUserId(this.userId);
    Object.defineProperty(this, 'dm', { value: dm });
    return dm;
  },

  /**
   * Send a message in a channel
   *
   * If options is provided, use the webClient instead
   */
  sendMessage(channelId, message, options) {
    _assert(channelId, _tcombForked2.default.String, 'channelId');

    _assert(message, _tcombForked2.default.String, 'message');

    _assert(options, _tcombForked2.default.maybe(_sendMessage.SendMessageOptionsType), 'options');

    return _assert(function () {
      return (0, _sendMessage2.default)(this, channelId, message, options);
    }.apply(this, arguments), _tcombForked2.default.Promise, 'return value');
  },

  /**
   * Reply in the same channel as the event
   */
  reply(message, options) {
    _assert(message, _tcombForked2.default.String, 'message');

    _assert(options, _tcombForked2.default.maybe(_sendMessage.SendMessageOptionsType), 'options');

    return _assert(function () {
      return this.sendMessage(this.channelId, message, options);
    }.apply(this, arguments), _tcombForked2.default.Promise, 'return value');
  },

  /**
   * Reply in the DM of the event's user
   */
  replyInDM(message, options) {
    _assert(message, _tcombForked2.default.String, 'message');

    _assert(options, _tcombForked2.default.maybe(_sendMessage.SendMessageOptionsType), 'options');

    return _assert(function () {
      if (this.channelId[0] === 'D') throw new Error('You are already in DM, use reply() instead');
      const userDM = this.userDM;
      if (userDM) {
        return this.sendMessage(userDM.id, message, options);
      }

      const user = this.user;
      this.webClient.im.open(user.id).then(res => (0, _sendMessage2.default)(res.channel.id, message, options));
    }.apply(this, arguments), _tcombForked2.default.Promise, 'return value');
  },

  mention(userId) {
    _assert(userId, _tcombForked2.default.maybe(_tcombForked2.default.String), 'userId');

    if (userId === undefined) userId = this.userId;
    if (userId[0] !== 'U') throw new Error(`Not a userId: "${userId}"`);
    return `<@${userId}>`;
  },

  get fromMe() {
    return this.userId === this.rtm.activeUserId;
  }
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
//# sourceMappingURL=contextPrototype.js.map