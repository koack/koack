/* @flow */
// eslint-disable-next-line import/no-unresolved, import/extensions
import { MongoClient } from 'mongodb';
import type { InstallInfoType, StorageType, TeamType } from '../../types';
import { createTeam, updateTeam } from '../utils';

export default async (mongoUrl: string): Promise<StorageType> => {
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
