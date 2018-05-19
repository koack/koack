import t from 'flow-runtime';
export const UserType = t.type('UserType', t.object(t.property('id', t.string()), t.property('name', t.nullable(t.string())), t.property('accessToken', t.string())));

export const InstallationInfoType = t.type('InstallationInfoType', t.object(t.property('user', UserType), t.property('date', t.union(t.ref('Date'), t.string())), t.property('scopes', t.array(t.string()))));

export const TeamIdType = t.type('TeamIdType', t.string());

export const TeamType = t.type('TeamType', t.object(t.property('id', TeamIdType), t.property('name', t.string()), t.property('bot', UserType), t.property('installations', t.nullable(t.array(InstallationInfoType)))));

export const InstallInfoType = t.type('InstallInfoType', t.intersection(InstallationInfoType, t.object(t.property('team', t.object(t.property('id', t.string()), t.property('name', t.string()))), t.property('bot', UserType))));

export const WhereType = t.type('WhereType', t.union(t.string('dm'), t.string('channel'), t.string('group')));

const CallbackTeamType = t.type('CallbackTeamType', t.function(t.param('team', TeamType), t.return(t.void())));


export const StorageType = t.type('StorageType', t.object(t.property('forEach', t.function(t.param('callback', CallbackTeamType), t.return(t.void()))), t.property('installedTeam', t.function(t.param('installInfo', InstallInfoType), t.return(t.union(t.ref('Promise', TeamType), TeamType))))));
//# sourceMappingURL=index.js.map