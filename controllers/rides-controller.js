var q = require('q');
var _ = require('lodash');
var bookshelf = require('../db/database');
var Ride = require('../db/models').Ride;
var Driver = require('../db/models').Driver;
var parseParams = require('./param-parser').parseSortFilterParams;
var errorUtility = require('../core/error-utility');
var config = require('../config');
var tripServiceTime = config.ride.serve.time;

var req_defaults = {
    page: 1,
    count: 1000,
    sort: '',
    filters: ''
};

function _getAll(req, res, next) {
    var opts = _.defaultsDeep({}, parseParams(req, req_defaults), req.query, req_defaults);
    var project_ids = [];

    var qry = Ride.query(function (qb) {
        _.forEach(opts.filters, function (val, key) {
            if (key) {
                qb = qb.whereIn(key, val);
            }
        });

        _.forEach(opts.sort, function (sort) {
            _.forEach(sort, function (val, key) {
                qb = qb.orderBy(key, val);
            })
        })
    });


    var rides = null;
    qry.fetchPage({
            offset: opts.start,
            limit: opts.count
        })
        .then(function (rides) {
            res.status(200).json({
                start: opts.start,
                count: rides.length,
                total_count: rides.pagination.rowCount,
                records: rides
            });
        })
        .catch(function (error) {
            if (!error) {
                error = {};
            }
            next(error);
        });
}

function _createRide(req, res, next) {
    var customer_id = req.body.customer_id;

    var data = {};
    data.customer_id = customer_id;
    Ride.create(data).then(function (ride) {
            res.status(201).json(ride);
        })
        .catch(function (err) {
            next(err);
        });
}

function _endTrip(ride_id) {
    bookshelf.transaction(function (trx) {
        return Ride.findById(ride_id, {withRelated: ['driver'], transacting: trx}).then(function (ride) {
            var status = ride.get("status");
            if (status == "Ongoing") {

                var tripEndTime = ride.get("trip_start_time").getTime() + tripServiceTime;
                ride.set("trip_end_time", new Date(tripEndTime));
                ride.set("status", "Completed");

                var driver = ride.related("driver");
                driver.set("current_ride_id", null);
                return ride.save(null, {transacting: trx}).then(function (ride) {
                    return driver.save(null, {transacting: trx});
                });
            }
        });
    });
};

function _serveRide(req, res, next) {
    var ride_id = req.params.ride_id;
    var driver_id = req.body.driver_id;

    if (!driver_id) {
        var error = {'message': "Invalid request data. driver_id is missing."};
        next(error);
        return;
    }
    var ride_obj = {};

    bookshelf.transaction(function (trx) {
            var qry = Ride.query(function (qb) {
                qb = qb.where('id', ride_id);
                qb = qb.forUpdate();
            });
            return qry.fetch({
                    withRelated: ['driver'],
                    transacting: trx
                })
                .then(function (ride) {
                        var assigned_driver_id = ride.get("driver_id");
                        if (assigned_driver_id) {
                            errorUtility.throwError("Ride No Longer Available", 400);
                        }
                        return Driver.findById(driver_id, {transacting: trx}).then(function (driver) {
                            var ride_id = driver.get("current_ride_id");
                            if (ride_id) {
                                errorUtility.throwError("Current Driver is currently handling some other ride", 400);
                            }
                            ride.set("driver_id", driver.id);
                            ride.set("trip_start_time", new Date());
                            ride.set("status", "Ongoing");

                            return ride.save(null, {transacting: trx}).then(function (ride) {
                                ride_obj = ride;
                                driver.set("current_ride_id", ride.id);
                                return driver.save(null, {transacting: trx});
                            });
                        });
                    }
                );

        })
        .then(function () {
            setTimeout(function () {
                _endTrip(ride_id);
            }, tripServiceTime);
            res.status(200).json(ride_obj);
        })
        .catch(function (error) {
            next(error);
        });
}

module.exports = {
    getRides: _getAll,
    createRide: _createRide,
    serveRide: _serveRide
};
