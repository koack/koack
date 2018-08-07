import { Action, Message } from './types';
import createActionHandlersMap from './createActionHandlersMap';

const handle = (ctx, extendsContext: Object, message: Message, action: Action) => {
  const messageCtx = Object.create(ctx);

  Object.assign(messageCtx, {
    message,
    ...extendsContext,
    logger: ctx.logger.context({
      ...ctx.logger._context,
      message,
    }),
  });

  action.handler(messageCtx);
};

const canCommandHandleWithMention = (
  hasMention: boolean,
  command,
  destinationType: ChannelType,
) => {
  if (!hasMention) {
    if (command.mention === false) return true;
    if (command.mention.includes(destinationType)) return false;
  } else {
    // if hasMention
    // eslint-disable-next-line no-lonely-if
    if (command.mention === false) return false;
  }
  return true;
};

export default (actions: Array<Action>) => {
  const mentionOnly = actions.every(action => action.mention === true);
  const map = createActionHandlersMap(actions);

  return (ctx, next) => {
    if (!ctx.event.text || ctx.userId === ctx.rtm.activeUserId) return;

    const botMention = `<@${ctx.rtm.activeUserId}>`;

    const { ts, text: originalText, type: messageType, subtype: messageSubtype } = ctx.event;
    const { teamId, userId, channelId } = ctx;
    const destinationType = ctx.getChannelType();
    let text = originalText;

    ctx.logger.debug('message', { ts, destinationType, text, messageType, messageSubtype });
    if (!destinationType) {
      ctx.logger.warn('Unsupported destination type', { destinationType });
      return next();
    }

    const startsWithMention = text.startsWith(botMention);
    const hasMention = startsWithMention || text.includes(botMention);

    if (mentionOnly && !hasMention) {
      return next();
    }

    const message: Message = { ts, text: originalText, teamId, userId, channelId };

    // Clean text
    // Remove mention
    if (startsWithMention) {
      text = text.substr(botMention.length);
    }

    // remove `:` (`@bot: do something !`)
    text = text.trim().replace(/^[\s:]*(?!\w)\s*/, '');

    // try to find a command
    const command = text.split(' ', 2)[0].toLowerCase();
    const actionCommand = command && map[destinationType].commands.get(command);

    if (actionCommand && canCommandHandleWithMention(hasMention, actionCommand, destinationType)) {
      text = text.substr(command.length).replace(/^[\s:]*(?!\w)\s*/, '');

      ctx.logger.debug('actionCommand', { command, text });

      handle(ctx, { text }, message, actionCommand);

      if (actionCommand.stop) {
        return;
      }
    }

    // try to find a matching regexp
    if (
      map[destinationType].regexps.some(action => {
        if (!canCommandHandleWithMention(hasMention, action, destinationType)) return false;

        const match = !action.regexp ? true : text.match(action.regexp);
        if (!match) return false;

        ctx.logger.debug('actionRegexp', { text, match });
        handle(ctx, { text, match }, message, action);

        return action.stop;
      })
    ) {
      return;
    }

    // Could not find anything
    return next();
  };
};
