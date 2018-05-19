

const extractIdFromEvent = key => event => {
  if (typeof event[key] === 'string') {
    return event[key];
  }
  if (typeof event[key] === 'object') {
    return event[key].id;
  }

  return null;
};

const extrackUserIdFromEvent = extractIdFromEvent('user');
const extrackChannelIdFromEvent = extractIdFromEvent('channel');

export default ((botContext, event) => {
  const ctx = Object.create(botContext);

  return Object.assign(ctx, {
    event,
    userId: extrackUserIdFromEvent(event),
    channelId: extrackChannelIdFromEvent(event),
    logger: ctx.logger.context({ text: event.text })
  });
});
//# sourceMappingURL=createContextFromEvent.js.map