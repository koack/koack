'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _koaRoute = require('koa-route');

var _koaRoute2 = _interopRequireDefault(_koaRoute);

var _form = require('co-body/lib/form');

var _form2 = _interopRequireDefault(_form);

var _ = require('../');

var _pool = require('../pool');

var _pool2 = _interopRequireDefault(_pool);

var _flowRuntime = require('flow-runtime');

var _flowRuntime2 = _interopRequireDefault(_flowRuntime);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Pool = _flowRuntime2.default.tdz(() => _pool2.default);

const OptionsType = _flowRuntime2.default.type('OptionsType', _flowRuntime2.default.object(_flowRuntime2.default.property('pool', _flowRuntime2.default.ref(Pool)), _flowRuntime2.default.property('token', _flowRuntime2.default.string()), _flowRuntime2.default.property('url', _flowRuntime2.default.nullable(_flowRuntime2.default.string()))));

exports.default = function interactiveMessages(_arg) {
  let { pool, token, url = '/interactive-message' } = OptionsType.assert(_arg);
  return _koaRoute2.default.post(url, async ctx => {
    let { payload } = await (0, _form2.default)(ctx);
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
};
//# sourceMappingURL=index.js.map