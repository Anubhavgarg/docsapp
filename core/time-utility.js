var moment = require('moment');

var _getHumanReadbleElapsedTime = function (time) {
    var current_time = new Date();
    var elapsedTime = current_time.getTime() - time.getTime();
    var elapsedDuration = moment.duration(elapsedTime);
    return elapsedDuration.humanize()
};

module.exports = {
    getHumanReadbleElapsedTime: _getHumanReadbleElapsedTime
};