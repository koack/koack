import { BaseContext, Context, ChannelType, EventContext } from '../types';
import sendMessage, { SendMessageOptions, MessageResult } from './prototype/sendMessage';

const baseContext: BaseContext = {
  getChannelType(this: EventContext): ChannelType {
    switch (this.channelId[0]) {
      case 'D':
        return 'dm';
      case 'C':
        return 'channel';
      case 'G':
        return 'group';
      default:
        throw new Error(`Invalid channel type: ${this.channelId[0]}`);
    }
  },

  async getChannelInfo(this: EventContext): Promise<any> {
    if (this._channel) return this._channel;
    if (!this.channelId) throw new Error('Invalid channelId');
    const result: any = await this.webClient.conversations.info({ channel: this.channelId });
    // https://api.slack.com/methods/conversations.info#response
    const channel = {
      id: result.channel.id,
      name: result.channel.name,
      created: result.channel.created,
      creator: result.channel.creator,
      isArchived: result.channel.is_archived,
      isGeneral: result.channel.is_general,
      unlinked: result.channel.unlinked,
      nameNormalized: result.channel.name_normalized,
      isReadOnly: result.channel.is_read_only,
      isShared: result.channel.is_shared,
      isExtShared: result.channel.is_ext_shared,
      isOrgShared: result.channel.is_org_shared,
      pendingShared: result.channel.pending_shared,
      isPendingExtShared: result.channel.is_pending_ext_shared,
      isMember: result.channel.is_member,
      isPrivate: result.channel.is_private,
      isMpim: result.channel.is_mpim,
      lastRead: result.channel.last_read,
      topic: result.channel.topic,
      purpose: result.channel.purpose,
      previousNames: result.channel.previous_names,
      numMembers: result.channel.num_members,
      locale: result.channel.locale,
    };
    Object.defineProperty(this, '_channel', { value: channel });
    return channel;
  },

  async getGroupInfo(this: EventContext) {
    // if (this.getChannelType() !== 'group') throw new Error('Invalid call to getGroupInfo with non-group channel');
    if (this._group) return this._group;
    if (!this.channelId) throw new Error('Invalid channelId');
    const result: any = await this.webClient.groups.info({ channel: this.channelId });
    // https://api.slack.com/methods/groups.info#response
    const group = {
      id: result.group.id,
      name: result.group.name,
      created: result.group.created,
      creator: result.group.creator,
      isArchived: result.group.is_archived,
      members: result.group.members,
      topic: result.group.topic,
      purpose: result.group.purpose,
      lastRead: result.group.last_read,
    };
    Object.defineProperty(this, '_group', { value: group });
    return group;
  },

  /**
   * Send a message in a channel
   *
   * If options is provided, use the webClient instead
   */
  sendMessage(
    this: Context,
    channelId: string,
    message: string,
    options?: SendMessageOptions,
  ): Promise<MessageResult> {
    return sendMessage(this, channelId, message, options);
  },

  /**
   * Reply in the same channel as the event
   */
  reply(this: EventContext, message: string, options?: SendMessageOptions): Promise<MessageResult> {
    return this.sendMessage(this.channelId, message, options);
  },

  /**
   * Reply in the DM of the event's user
   */
  replyInDM(
    this: EventContext,
    message: string,
    options?: SendMessageOptions,
  ): Promise<MessageResult> {
    if (this.channelId[0] === 'D') throw new Error('You are already in DM, use reply() instead');
    const userDM = this.userDM;
    if (userDM) {
      return this.sendMessage(userDM.id, message, options);
    }

    const user = this.user;
    return this.webClient.im
      .open(user.id)
      .then((res: any) => this.sendMessage(res.channel.id, message, options));
  },

  mention(this: EventContext, userId?: string): string {
    if (userId === undefined) userId = this.userId;
    if (userId[0] !== 'U') throw new Error(`Not a userId: "${userId}"`);
    return `<@${userId}>`;
  },

  get isFromMe(this: EventContext): boolean {
    return this.userId === this.rtm.activeUserId;
  },

  get fromMe() {
    throw new Error('ctx.fromMe is deprecated, use isFromMe() insteand');
  },
};

export default baseContext;
