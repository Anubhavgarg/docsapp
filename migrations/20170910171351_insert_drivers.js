
exports.up = function(knex, Promise) {
    return Promise.all([
        knex("da_driver").insert({ name: "Driver 1"}),
        knex("da_driver").insert({ name: "Driver 2"}),
        knex("da_driver").insert({ name: "Driver 3"}),
        knex("da_driver").insert({ name: "Driver 4"}),
        knex("da_driver").insert({ name: "Driver 5"})
    ])
};

exports.down = function(knex, Promise) {
    return Promise.all([
        knex("da_driver").del()
    ])
};
