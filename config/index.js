var _ = require('lodash'),
    defaults = {};

_.set(defaults, "db.docsapp", {
    host: 'localhost',
    user: 'root',
    password: '@anubhav',
    database: 'ola_simulator_backend'
});

_.set(defaults, "ride.serve.time", 5 * 60 * 1000);

exports = module.exports = defaults;