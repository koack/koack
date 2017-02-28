
import createContextFromBot from './createContextFromBot';


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

export default ((bot, event) => {
  const ctx = createContextFromBot(bot);

  Object.assign(ctx, {
    event,
    userId: extrackUserIdFromEvent(event),
    channelId: extrackChannelIdFromEvent(event)
  });

  ctx.logger.extendsContext({
    text: event.text
  });

  return ctx;
});
//# sourceMappingURL=createContextFromEvent.js.map