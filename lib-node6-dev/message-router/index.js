'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _tcombForked = require('tcomb-forked');

var _tcombForked2 = _interopRequireDefault(_tcombForked);

var _nightingaleLogger = require('nightingale-logger');

var _nightingaleLogger2 = _interopRequireDefault(_nightingaleLogger);

var _types = require('../types');

var _createActionHandlersMap = require('./createActionHandlersMap');

var _createActionHandlersMap2 = _interopRequireDefault(_createActionHandlersMap);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const logger = new _nightingaleLogger2.default('koack:message-router');

const handle = (ctx, message, action, extendsContext) => {
  _assert(message, _types.MessageType, 'message');

  _assert(action, _types.ActionType, 'action');

  _assert(extendsContext, _tcombForked2.default.Object, 'extendsContext');

  let messageCtx = Object.create(ctx);

  Object.assign(messageCtx, _extends({
    message
  }, extendsContext, {
    logger: ctx.logger.context(_extends({}, ctx.logger._context, {
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

exports.default = function messageRouter(actions) {
  _assert(actions, _tcombForked2.default.list(_types.ActionType), 'actions');

  const mentionOnly = actions.every(action => action.mention === true);
  const map = (0, _createActionHandlersMap2.default)(actions);

  return (ctx, next) => {
    if (!ctx.event.text) return;

    const botMention = `<@${ ctx.rtm.activeUserId }>`;

    const { ts, text: originalText, type: messageType, subtype: messageSubtype } = ctx.event;
    const { teamId, userId, channelId } = ctx;
    const destinationType = ctx.getChannelType();
    let text = originalText;

    logger.debug('message', { ts, destinationType, text, messageType, messageSubtype });
    if (!destinationType) {
      logger.warn('Unsupported destination type', { destinationType });
      return next();
    }

    const hasMention = text.startsWith(botMention);

    if (mentionOnly && !hasMention) {
      return next();
    }

    const message = _assert({ ts, text: originalText, teamId, userId, channelId }, _types.MessageType, 'message');

    // Clean text
    // Remove mention
    if (hasMention) {
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

function _assert(x, type, name) {
  function message() {
    return 'Invalid value ' + _tcombForked2.default.stringify(x) + ' supplied to ' + name + ' (expected a ' + _tcombForked2.default.getTypeName(type) + ')';
  }

  if (_tcombForked2.default.isType(type)) {
    if (!type.is(x)) {
      type(x, [name + ': ' + _tcombForked2.default.getTypeName(type)]);

      _tcombForked2.default.fail(message());
    }
  } else if (!(x instanceof type)) {
    _tcombForked2.default.fail(message());
  }

  return x;
}
//# sourceMappingURL=index.js.map