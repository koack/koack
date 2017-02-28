
// eslint-disable-next-line import/no-unresolved, import/extensions
import { MongoClient } from 'mongodb';

import { createTeam, updateTeam } from '../utils';

export default (async mongoUrl => {
  const connection = await MongoClient.connect(mongoUrl);
  const teams = connection.collection('teams');

  return {
    forEach: callback => teams.find({}).forEach(callback),

    installedTeam: async installInfo => {
      let team = await teams.findOne({ _id: installInfo.team.id });

      if (!team) {
        team = Object.assign({
          _id: installInfo.team.id
        }, createTeam(installInfo));

        await teams.insertOne(team);
      } else {
        team = updateTeam(team, installInfo);
      }

      return team;
    }
  };
});
//# sourceMappingURL=index.js.map