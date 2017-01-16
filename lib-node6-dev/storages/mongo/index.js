'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _arguments = arguments;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _tcombForked = require('tcomb-forked');

var _tcombForked2 = _interopRequireDefault(_tcombForked);

var _mongodb = require('mongodb');

var _types = require('../../types');

var _utils = require('../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }
// eslint-disable-next-line import/no-unresolved, import/extensions


exports.default = function mongo(mongoUrl) {
  _assert(mongoUrl, _tcombForked2.default.String, 'mongoUrl');

  return _assert(_asyncToGenerator(function* () {
    const connection = yield _mongodb.MongoClient.connect(mongoUrl);
    const teams = connection.collection('teams');

    return {
      forEach: function (callback) {
        return teams.find({}).forEach(callback);
      },

      installedTeam: (() => {
        var _ref2 = _asyncToGenerator(function* (installInfo) {
          _assert(installInfo, _types.InstallInfoType, 'installInfo');

          let team = _assert((yield teams.findOne({ _id: installInfo.team.id })), _tcombForked2.default.maybe(_types.TeamType), 'team');

          if (!team) {
            team = _assert(_extends({
              _id: installInfo.team.id
            }, (0, _utils.createTeam)(installInfo)), _tcombForked2.default.maybe(_types.TeamType), 'team');

            yield teams.insertOne(team);
          } else {
            team = _assert((0, _utils.updateTeam)(team, installInfo), _tcombForked2.default.maybe(_types.TeamType), 'team');
          }

          return team;
        });

        return function installedTeam(_x) {
          return _ref2.apply(this, arguments);
        };
      })()
    };
  }).apply(undefined, _arguments), _tcombForked2.default.Promise, 'return value');
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