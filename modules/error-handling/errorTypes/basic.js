const isValid = function (error) {
    return Object.keys(error).length === 2 && error.source && error.inner;
};

const run = function (errorHandling, error) {
    return errorHandling.throwError(error.source, error.inner);
};

module.exports = { isValid, run };