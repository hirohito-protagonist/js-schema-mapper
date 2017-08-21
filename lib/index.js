
const Utils = require('./utils');

const internals = {};

internals.map = (schema, source) => {

    const out = {};
    
    function map_(destination, m, s) {
        for (var key in m) {
            destination[key] = s[key] && Utils.isType(m[key], s[key]) ? s[key]:  m[key]();
        }
    }

    map_(out, schema, source);

    return out;
};

internals.schema = (schema) => {

    return {
        map: (source) => {

            if (
                source === null ||
                Utils.isUndefined(source) ||
                Utils.isType(Boolean, source) ||
                Utils.isType(Number, source) ||
                Utils.isType(String, source) ||
                Utils.isType(Function, source) ||
                Utils.isType(Date, source) ||
                Utils.isType(RegExp, source) ||
                Utils.isType(Array, source)
            ) {
                return null;
            }

            return internals.map(schema, source);
        }
    };
};

module.exports = {
    schema: internals.schema
};