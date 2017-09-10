exports = module.exports = [
    //Rides
    ['/api/v1/ride',
        'rides-controller#getRides',
        'GET'],

    ['/api/v1/ride',
        'rides-controller#createRide',
        'POST'],

    ['/api/v1/ride/:ride_id/serve',
        'rides-controller#serveRide',
        'PUT'],

    //Driver
    ['/api/v1/driver/:driver_id',
        'driver-controller#getDriverDetails',
        'GET']
];