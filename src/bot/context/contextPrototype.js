import sendMessage, { type SendMessageOptionsType } from './prototype/sendMessage';

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
  sendMessage(channelId: string, message: string, options: ?SendMessageOptionsType): Promise<any> {
    return sendMessage(this, channelId, message, options);
  },

  /**
   * Reply in the same channel as the event
   */
  reply(message: string, options: ?SendMessageOptionsType): Promise<any> {
    return this.sendMessage(this.channelId, message, options);
  },

  /**
   * Reply in the DM of the event's user
   */
  replyInDM(message: string, options: ?SendMessageOptionsType): Promise<any> {
    if (this.channelId[0] === 'D') throw new Error('You are already in DM, use reply() instead');
    const userDM = this.userDM;
    if (userDM) {
      return this.sendMessage(userDM.id, message, options);
    }

    const user = this.user;
    return this.webClient.im.open(user.id)
      .then((res) => sendMessage(res.channel.id, message, options));
  },

  mention(userId: ?string) {
    if (userId === undefined) userId = this.userId;
    if (userId[0] !== 'U') throw new Error(`Not a userId: "${userId}"`);
    return `<@${userId}>`;
  },

  get fromMe() {
    return this.userId === this.rtm.activeUserId;
  },
};
