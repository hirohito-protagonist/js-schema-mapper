const internals = {};

internals.isType = (type, value) => {

    return typeof value !== 'undefined' && value !== null && value.constructor === type || value instanceof type;
};

internals.isUndefined = (value) => {

    return typeof value === 'undefined';
};

module.exports = {
    isType: internals.isType,
    isUndefined: internals.isUndefined
};