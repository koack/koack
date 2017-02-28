'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _nightingaleLogger = require('nightingale-logger');

var _nightingaleLogger2 = _interopRequireDefault(_nightingaleLogger);

var _createActionHandlersMap = require('./createActionHandlersMap');

var _createActionHandlersMap2 = _interopRequireDefault(_createActionHandlersMap);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const logger = new _nightingaleLogger2.default('koack:message-router');

const handle = (ctx, message, action, extendsContext) => {
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

exports.default = actions => {
  const mentionOnly = actions.every(action => action.mention === true);
  const map = (0, _createActionHandlersMap2.default)(actions);

  return (ctx, next) => {
    if (!ctx.event.text || ctx.userId === ctx.rtm.activeUserId) return;

    const botMention = `<@${ctx.rtm.activeUserId}>`;

    const { ts, text: originalText, type: messageType, subtype: messageSubtype } = ctx.event;
    const { teamId, userId, channelId } = ctx;
    const destinationType = ctx.getChannelType();
    let text = originalText;

    logger.debug('message', { ts, destinationType, text, messageType, messageSubtype });
    if (!destinationType) {
      logger.warn('Unsupported destination type', { destinationType });
      return next();
    }

    const startsWithMention = text.startsWith(botMention);
    const hasMention = startsWithMention || text.includes(botMention);

    if (mentionOnly && !hasMention) {
      return next();
    }

    const message = { ts, text: originalText, teamId, userId, channelId };

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

      logger.debug('actionCommand', { command, text });

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

      logger.debug('actionRegexp', { text, match });
      handle(ctx, message, action, { text, match });

      return action.stop;
    })) {
      return;
    }

    // Could not find anything
    return next();
  };
};
//# sourceMappingURL=index.js.map