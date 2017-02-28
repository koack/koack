var production = process.env.NODE_ENV === 'production';
if (process.version.startsWith && process.version.startsWith('v7.'))
    return module.exports = require('./lib-node7' + (production ? '' : '-dev') + '/pool');
if (process.version.startsWith && process.version.startsWith('v6.'))
    return module.exports = require('./lib-node6' + (production ? '' : '-dev') + '/pool');
throw new Error('Platform not supported: ' + process.version + '.');
