'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var route = _interopDefault(require('koa-route'));
var parse = _interopDefault(require('co-body/lib/form'));
var koackCore = require('koack-core');

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function step(key, arg) {
        try {
          var info = gen[key](arg);
          var value = info.value;
        } catch (error) {
          reject(error);
          return;
        }

        if (info.done) {
          resolve(value);
        } else {
          Promise.resolve(value).then(_next, _throw);
        }
      }

      function _next(value) {
        step("next", value);
      }

      function _throw(err) {
        step("throw", err);
      }

      _next();
    });
  };
}

var index = (({
  pool,
  token,
  url = '/interactive-message'
}) => route.post(url,
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(function* (ctx) {
    let {
      payload
    } = yield parse(ctx);
    if (!payload) throw new Error('Invalid payload');
    payload = JSON.parse(payload);
    if (payload.token !== token) throw new Error('Invalid token');
    const {
      actions,
      callback_id: callbackId,
      team,
      channel,
      user,
      action_ts: actionTs,
      message_ts: messageTs,
      attachment_id: attachmentId,
      original_message: originalMessage,
      response_url: responseUrl
    } = payload;
    pool.sendBotMessage(team.id, {
      type: 'event',
      name: koackCore.INTERACTIVE_MESSAGE_RESPONSE.toString(),
      data: {
        actions,
        callbackId,
        team,
        channel,
        user,
        actionTs,
        messageTs,
        attachmentId,
        originalMessage,
        responseUrl
      }
    });
  });

  return function () {
    return _ref.apply(this, arguments);
  };
}()));

exports.default = index;
//# sourceMappingURL=index-node6-dev.cjs.js.map
