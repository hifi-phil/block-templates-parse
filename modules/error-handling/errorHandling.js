var pluginError = require('plugin-error');

const errorFormats = [
    require('./errorTypes/stream'),
    require('./errorTypes/basic'),
];

const identifyErrorType = function(error) {
    errorFormats.forEach((format) => {
        if(format.isValid(error)) {
            format.run(this, error);
        }
    });
};

const throwErrorArray = function(errors) {
    errors.forEach((error) => {
        run(error);
    });
};

const throwError = function(errorSource, message) {
    run(createError(errorSource, message));
};

const createError = function(errorSource, message) {
    return {
        source: errorSource,
        inner: message
    };
};

const run = function(error) {
    new pluginError(error.source, error.inner);
};

module.exports = {throwError, throwErrorArray, createError, identifyErrorType, run};