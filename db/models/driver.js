var bookshelf = require('../database');
var moment = require('moment');

var Driver = bookshelf.Model.extend({
    tableName: 'da_driver',
    current_ride: function () {
        return this.belongsTo('Ride', 'current_ride_id', 'id');
    }
},{});

module.exports = bookshelf.model('Driver', Driver);