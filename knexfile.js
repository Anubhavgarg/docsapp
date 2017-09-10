// Update with your config settings.
var config      = require('./config');

module.exports = {

  development: {
    client: 'mysql',
    connection: config.db.docsapp,
    pool: {
      min: 1,
      max: 5
    },
    migrations: {
      tableName: 'da_migrations'
    }
  }
};
