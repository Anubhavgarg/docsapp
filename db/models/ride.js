var bookshelf = require('../database');
var time_utility = require('../../core/time-utility');
var moment = require('moment');

var Ride = bookshelf.Model.extend({
    tableName: 'da_ride',
    driver: function () {
        return this.belongsTo('Driver', 'driver_id', 'id');
    },
    virtuals: {
        request_time_elapsed: function () {
            if (this.get("created_at"))
                return time_utility.getHumanReadbleElapsedTime(this.get("created_at"));
            else
                return null;
        },
        pickup_time_elapsed: function () {
            if (this.get("status") != "Waiting" && this.get("trip_start_time"))
                return time_utility.getHumanReadbleElapsedTime(this.get("trip_start_time"));
            else
                return null;
        },
        completed_time_elapsed: function () {
            if (this.get("status") == "Completed" && this.get("trip_end_time"))
                return time_utility.getHumanReadbleElapsedTime(this.get("trip_end_time"));
            else
                return null;
        }
    }
}, {});

module.exports = bookshelf.model('Ride', Ride);