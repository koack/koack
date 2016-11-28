import compose from 'koa-compose';

type DescriptorType = {|
  commands: ?Array<string>,
  regexp: ?RegExp,
  stop: ?bool,
  handler: ?Function,
  middlewares: ?Array<Function>
|};

type MessageType = {|
  ts: number,
  text: string,
  teamId: any,
  userId: any,
  channelId: any,
|};

const matches = (ctx, descriptor) => {

};

export default (descriptor: DescriptorType) => {
  const callback = descriptor.handler || compose(descriptor.middlewares);
  return (ctx, next) => {
    const botMention = `<@${ctx.rtm.activeUserId}>`;

    const { text, type, subtype, channel: channelId, user: userId, ts, team: teamId } = ctx.event;
    let messageCtx = Object.create(ctx);

    Object.assign(
      messageCtx,
      { ts, teamId, channelId, userId, text, logger },
    );


    if (!matches(ctx, descriptor)) return next();
  };
};
