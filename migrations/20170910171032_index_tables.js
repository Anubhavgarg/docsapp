
exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.table('da_ride', function (table) {
            table.index('status', ['i_da_ride_status']);
            table.index('driver_id', ['i_da_ride_driver_id']);
            table.index('customer_id', ['i_da_ride_customer_id']);
        }),
        knex.schema.table('da_driver', function (table) {
            table.index('current_ride_id', ['i_da_driver_current_ride_id']);
        })
    ])
};

exports.down = function(knex, Promise) {
    return Promise.all([])
};
