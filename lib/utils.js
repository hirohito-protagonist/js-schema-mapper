const internals = {};

internals.isType = (type, value) => {

    return typeof value !== 'undefined' && value !== null && value.constructor === type || value instanceof type;
};

module.exports = {
    isType: internals.isType
};