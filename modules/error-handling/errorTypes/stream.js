const isValid = function (error) {
    return error.type && error.type === 'unsupported streaming';
};

const run = function (errorHandling, error) {
    return errorHandling.throwError(error.source, 'Streaming is not supported');
};

module.exports = { isValid, run };