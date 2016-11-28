export default {
  get dm() {
    return this.dm = this.rtm.dataStore.getDMById(this.channelId);
  },

  get channel() {
    return this.channel = this.rtm.dataStore.getChannelById(this.channelId);
  },

  get group() {
    return this.group = this.rtm.dataStore.getGroupById(this.channelId);
  },
};
