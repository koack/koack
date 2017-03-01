import { ActionType as _ActionType, MessageType as _MessageType } from './types';
import createActionHandlersMap from './createActionHandlersMap';

import t from 'flow-runtime';
const ActionType = t.tdz(() => _ActionType);
const MessageType = t.tdz(() => _MessageType);
const handle = (ctx, message, action, extendsContext) => {
  let _messageType = t.ref(MessageType);

  let _actionType = t.ref(ActionType);

  let _extendsContextType = t.object();

  t.param('message', _messageType).assert(message);
  t.param('action', _actionType).assert(action);
  t.param('extendsContext', _extendsContextType).assert(extendsContext);

  let messageCtx = Object.create(ctx);

  Object.assign(messageCtx, Object.assign({
    message
  }, extendsContext, {
    logger: ctx.logger.context(Object.assign({}, ctx.logger._context, {
      message
    }))
  }));

  action.handler(messageCtx);
};

const canCommandHandleWithMention = (hasMention, command, destinationType) => {
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

export default (function messageRouter(actions) {
  let _actionsType = t.array(t.ref(ActionType));

  t.param('actions', _actionsType).assert(actions);

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

    const message = t.ref(MessageType).assert({ ts, text: originalText, teamId, userId, channelId });

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

      handle(ctx, message, actionCommand, { text });

      if (actionCommand.stop) {
        return;
      }
    }

    // try to find a matching regexp
    if (map[destinationType].regexps.some(action => {
      if (!canCommandHandleWithMention(hasMention, action, destinationType)) return false;

      const match = !action.regexp ? true : text.match(action.regexp);
      if (!match) return false;

      ctx.logger.debug('actionRegexp', { text, match });
      handle(ctx, message, action, { text, match });

      return action.stop;
    })) {
      return;
    }

    // Could not find anything
    return next();
  };
});
//# sourceMappingURL=index.js.map