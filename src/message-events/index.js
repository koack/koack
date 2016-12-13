import EventEmitter from 'events';
import Logger from 'nightingale-logger/src';

const logger = new Logger('koack:message-events');

export default () => {
  const eventEmitter = new EventEmitter();

  return (ctx, next) => {
    const { teamId, userId, channelId } = ctx;
    const { ts, text: originalText, type: messageType, subtype: messageSubtype } = ctx.event;
    const destinationType = ctx.getChannelType();

    if (!destinationType) {
      logger.warn('Unsupported destination type', { destinationType });
      return next();
    }

    const message: MessageType = { ts, text: originalText, teamId, userId, channelId };

  };
};
