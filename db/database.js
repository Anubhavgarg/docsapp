var config      = require('../config');
var knex = require('knex')({client: 'mysql',
    connection: config.db.docsapp,
    pool: {min:2, max:100}
});
var bookshelf = require('bookshelf')(knex);


var ModelBase = require('bookshelf-modelbase')(bookshelf);
bookshelf.plugin(require('bookshelf-modelbase').pluggable);
bookshelf.plugin(require('bookshelf-paranoia'));
bookshelf.plugin(require('bookshelf-json-columns'));

bookshelf.plugin('registry');
bookshelf.plugin('pagination');
bookshelf.plugin('virtuals');

module.exports = bookshelf;