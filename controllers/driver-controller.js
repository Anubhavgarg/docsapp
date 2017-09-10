var q = require('q');
var _ = require('lodash');
var Driver = require('../db/models').Driver;
var errorUtility = require('../core/error-utility').Ride;

var req_defaults = {
    page: 1,
    count: 1000,
    sort: '',
    filters: ''
};

function _getDriver(req, res, next) {
    var driver_id = req.params.driver_id;

    if (!driver_id) {
        var error = {'message': "Invalid request data. driver_id is missing."};
        next(error);
        return;
    }

    Driver.findById(driver_id, {withRelated: ['current_ride']})
        .then(function (driver) {
            res.status(200).json(driver);
        })
        .catch(function (error) {
            console.log("Unable to get driver details for id : %s", driver_id, error);
            next(error);
        });
}

module.exports = {
    getDriverDetails: _getDriver
};
