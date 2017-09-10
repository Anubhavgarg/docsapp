_throwError = function (message, status) {
    throw ({message: message, status: status});
};

module.exports = {
    throwError: _throwError
};