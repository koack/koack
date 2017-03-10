
// eslint-disable-next-line import/no-unresolved, import/extensions
import { MongoClient } from 'mongodb';
import { InstallInfoType as _InstallInfoType, StorageType as _StorageType, TeamType as _TeamType } from '../../types';
import { createTeam, updateTeam } from '../utils';

import t from 'flow-runtime';
const InstallInfoType = t.tdz(() => _InstallInfoType);
const StorageType = t.tdz(() => _StorageType);
const TeamType = t.tdz(() => _TeamType);
export default (async function mongo(mongoUrl) {
  let _mongoUrlType = t.string();

  const _returnType = t.return(t.union(t.ref(StorageType), t.ref('Promise', t.ref(StorageType))));

  t.param('mongoUrl', _mongoUrlType).assert(mongoUrl);

  const connection = await MongoClient.connect(mongoUrl);
  const teams = connection.collection('teams');

  return _returnType.assert({
    forEach: callback => teams.find({}).forEach(callback),

    installedTeam: async installInfo => {
      let _installInfoType = t.ref(InstallInfoType);

      t.param('installInfo', _installInfoType).assert(installInfo);

      let _teamType = t.nullable(t.ref(TeamType)),
          team = _teamType.assert((await teams.findOne({ _id: installInfo.team.id })));

      if (!team) {
        team = _teamType.assert(Object.assign({
          _id: installInfo.team.id
        }, createTeam(installInfo)));

        await teams.insertOne(team);
      } else {
        team = _teamType.assert(updateTeam(team, installInfo));
      }

      return team;
    }
  });
});
//# sourceMappingURL=index.js.map