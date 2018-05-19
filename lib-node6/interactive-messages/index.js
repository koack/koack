'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _koaRoute = require('koa-route');

var _koaRoute2 = _interopRequireDefault(_koaRoute);

var _form = require('co-body/lib/form');

var _form2 = _interopRequireDefault(_form);

var _ = require('../');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = ({ pool, token, url = '/interactive-message' }) => _koaRoute2.default.post(url, (() => {
  var _ref = _asyncToGenerator(function* (ctx) {
    let { payload } = yield (0, _form2.default)(ctx);
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

    pool.sendBotMessage(team.id, { type: 'event', name: _.INTERACTIVE_MESSAGE_RESPONSE.toString(), data: {
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
      } });
  });

  return function () {
    return _ref.apply(this, arguments);
  };
})());
//# sourceMappingURL=index.js.map