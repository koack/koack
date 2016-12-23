'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
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

  reply(string) {
    this.rtm.sendMessage(string, this.channelId);
  },

  replyInDM(string) {
    this.rtm.sendMessage(string, this.userDM);
  },

  mention(userId) {
    if (userId === undefined) userId = this.userId;
    if (userId[0] !== 'U') throw new Error(`Not a userId: "${ userId }"`);
    return `<@${ userId }>`;
  },

  get fromMe() {
    return this.userId === this.rtm.activeUserId;
  }
};
//# sourceMappingURL=contextPrototype.js.map