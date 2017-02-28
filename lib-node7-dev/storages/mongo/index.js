'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongodb = require('mongodb');

var _types = require('../../types');

var _utils = require('../utils');

var _flowRuntime = require('flow-runtime');

var _flowRuntime2 = _interopRequireDefault(_flowRuntime);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// eslint-disable-next-line import/no-unresolved, import/extensions
const InstallInfoType = _flowRuntime2.default.tdz(() => _types.InstallInfoType);

const StorageType = _flowRuntime2.default.tdz(() => _types.StorageType);

const TeamType = _flowRuntime2.default.tdz(() => _types.TeamType);

exports.default = async function mongo(mongoUrl) {
  let _mongoUrlType = _flowRuntime2.default.string();

  const _returnType = _flowRuntime2.default.return(_flowRuntime2.default.union(_flowRuntime2.default.ref(StorageType), _flowRuntime2.default.ref('Promise', _flowRuntime2.default.ref(StorageType))));

  _flowRuntime2.default.param('mongoUrl', _mongoUrlType).assert(mongoUrl);

  const connection = await _mongodb.MongoClient.connect(mongoUrl);
  const teams = connection.collection('teams');

  return _returnType.assert({
    forEach: callback => teams.find({}).forEach(callback),

    installedTeam: async installInfo => {
      let _installInfoType = _flowRuntime2.default.ref(InstallInfoType);

      _flowRuntime2.default.param('installInfo', _installInfoType).assert(installInfo);

      let _teamType = _flowRuntime2.default.nullable(_flowRuntime2.default.ref(TeamType)),
          team = _teamType.assert((await teams.findOne({ _id: installInfo.team.id })));

      if (!team) {
        team = _teamType.assert(Object.assign({
          _id: installInfo.team.id
        }, (0, _utils.createTeam)(installInfo)));

        await teams.insertOne(team);
      } else {
        team = _teamType.assert((0, _utils.updateTeam)(team, installInfo));
      }

      return team;
    }
  });
};
//# sourceMappingURL=index.js.map