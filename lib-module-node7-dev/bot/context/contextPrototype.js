import sendMessage, { SendMessageOptionsType as _SendMessageOptionsType } from './prototype/sendMessage';

import t from 'flow-runtime';
const SendMessageOptionsType = t.tdz(() => _SendMessageOptionsType);
export default {
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
    let _channelIdType = t.string();

    let _messageType = t.string();

    let _optionsType = t.nullable(t.ref(SendMessageOptionsType));

    const _returnType = t.return(t.any());

    t.param('channelId', _channelIdType).assert(channelId);
    t.param('message', _messageType).assert(message);
    t.param('options', _optionsType).assert(options);

    return sendMessage(this, channelId, message, options).then(_arg => _returnType.assert(_arg));
  },

  /**
   * Reply in the same channel as the event
   */
  reply(message, options) {
    let _messageType2 = t.string();

    let _optionsType2 = t.nullable(t.ref(SendMessageOptionsType));

    const _returnType2 = t.return(t.any());

    t.param('message', _messageType2).assert(message);
    t.param('options', _optionsType2).assert(options);

    return this.sendMessage(this.channelId, message, options).then(_arg2 => _returnType2.assert(_arg2));
  },

  /**
   * Reply in the DM of the event's user
   */
  replyInDM(message, options) {
    let _messageType3 = t.string();

    let _optionsType3 = t.nullable(t.ref(SendMessageOptionsType));

    const _returnType3 = t.return(t.any());

    t.param('message', _messageType3).assert(message);
    t.param('options', _optionsType3).assert(options);

    if (this.channelId[0] === 'D') throw new Error('You are already in DM, use reply() instead');
    const userDM = this.userDM;
    if (userDM) {
      return this.sendMessage(userDM.id, message, options).then(_arg3 => _returnType3.assert(_arg3));
    }

    const user = this.user;
    return this.webClient.im.open(user.id).then(res => sendMessage(res.channel.id, message, options)).then(_arg4 => _returnType3.assert(_arg4));
  },

  mention(userId) {
    let _userIdType = t.nullable(t.string());

    t.param('userId', _userIdType).assert(userId);

    if (userId === undefined) userId = _userIdType.assert(this.userId);
    if (userId[0] !== 'U') throw new Error(`Not a userId: "${userId}"`);
    return `<@${userId}>`;
  },

  get fromMe() {
    return this.userId === this.rtm.activeUserId;
  }
};
//# sourceMappingURL=contextPrototype.js.map