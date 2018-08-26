
// eslint-disable-next-line import/no-unresolved, import/extensions
import { MongoClient } from 'mongodb';
import { Storage, InstallInfo, Team } from 'koack-types';
import { createTeam, updateTeam } from 'koack-storage-utils';

export default async (mongoUrl: string): Promise<Storage> => {
  const connection = await MongoClient.connect(mongoUrl);
  const teams = connection.collection('teams');

  return {
    forEach: (callback) => teams.find({}).forEach(callback),

    installedTeam: async (installInfo: InstallInfoType) => {
      let team: ?TeamType = await teams.findOne({ _id: installInfo.team.id });

      if (!team) {
        team = {
          _id: installInfo.team.id,
          ...createTeam(installInfo),
        };

        await teams.insertOne(team);
      } else {
        team = updateTeam(team, installInfo);
      }

      return team;
    },
  };
};
