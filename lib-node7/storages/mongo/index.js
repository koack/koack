'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongodb = require('mongodb');

var _utils = require('../utils');

// eslint-disable-next-line import/no-unresolved, import/extensions
exports.default = async mongoUrl => {
  const connection = await _mongodb.MongoClient.connect(mongoUrl);
  const teams = connection.collection('teams');

  return {
    forEach: callback => teams.find({}).forEach(callback),

    installedTeam: async installInfo => {
      let team = await teams.findOne({ _id: installInfo.team.id });

      if (!team) {
        team = Object.assign({
          _id: installInfo.team.id
        }, (0, _utils.createTeam)(installInfo));

        await teams.insertOne(team);
      } else {
        team = (0, _utils.updateTeam)(team, installInfo);
      }

      return team;
    }
  };
};
//# sourceMappingURL=index.js.map