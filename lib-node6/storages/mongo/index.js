'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongodb = require('mongodb');

var _utils = require('../utils');

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }
// eslint-disable-next-line import/no-unresolved, import/extensions


exports.default = (() => {
  var _ref = _asyncToGenerator(function* (mongoUrl) {
    const connection = yield _mongodb.MongoClient.connect(mongoUrl);
    const teams = connection.collection('teams');

    return {
      forEach: function (callback) {
        return teams.find({}).forEach(callback);
      },

      installedTeam: (() => {
        var _ref2 = _asyncToGenerator(function* (installInfo) {
          let team = yield teams.findOne({ _id: installInfo.team.id });

          if (!team) {
            team = Object.assign({
              _id: installInfo.team.id
            }, (0, _utils.createTeam)(installInfo));

            yield teams.insertOne(team);
          } else {
            team = (0, _utils.updateTeam)(team, installInfo);
          }

          return team;
        });

        return function installedTeam() {
          return _ref2.apply(this, arguments);
        };
      })()
    };
  });

  return function () {
    return _ref.apply(this, arguments);
  };
})();
//# sourceMappingURL=index.js.map