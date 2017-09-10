var _ = require('lodash');


exports.parseSortFilterParams = function (req, defaults) {
    var params = _.defaultsDeep({}, req.query, defaults);
    params = _.pick(params, ['sort', 'filters']);

    var sort_string = _.get(params, 'sort', '');
    params.sort = [];
    if (!_.isEmpty(sort_string)) {
        var sort_list = sort_string.split(';');

        _.forEach(sort_list, function (val) {
            if (val) {
                srt = val.split(':');
                params.sort.push(_.set({}, _.trim(srt[0]), _.trim(srt[1])));
            }
        });
    }


    var filter_string = _.get(params, 'filters', '');
    params.filters = {};
    if (!_.isEmpty(filter_string)) {
        var filter_list = filter_string.split(';');

        _.forEach(filter_list, function (val) {
            if (val) {
                flt = val.split(':');
                var key = flt.splice(0, 1);
                values = flt.join(':');
                var val_list = values.split(',');
                _.set(params.filters, _.trim(key), _.map(val_list, function (value) {
                    return _.trim(value)
                }));
            }
        });
    }

    return params;
}


exports.parseFilterPostParams = function (req, defaults) {
    var params = _.defaultsDeep({}, req.body, defaults);
    params = _.pick(params, ['filters']);

    var filter_obj = _.get(params, 'filters', {});
    params.filters = {};

    _.forOwn(filter_obj, function (value, key) {
        params.filters[key] = value;
    });

    return params;
};