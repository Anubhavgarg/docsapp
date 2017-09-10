exports.up = function (knex, Promise) {
    return Promise.all([
        knex.schema.createTable('da_ride', function (table) {
            table.increments();
            table.integer('customer_id').notNullable();
            table.integer('driver_id');
            table.string('status', 64).defaultTo('Waiting');
            table.datetime('trip_start_time');
            table.datetime('trip_end_time');
            table.timestamps(true, true);
        }),
        knex.schema.createTable('da_driver', function (table) {
            table.increments();
            table.string('name', 256);
            table.integer('current_ride_id');
            table.timestamps(true, true);
        })
    ]);
};

exports.down = function (knex, Promise) {
    return Promise.all([
        knex.schema.dropTable('da_ride'),
        knex.schema.dropTable('da_driver')
    ]);
};
