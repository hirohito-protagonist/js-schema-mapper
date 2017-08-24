
const Utils = require('./utils');

const internals = {};

internals.map = (schema, source) => {

    const out = {};
    
    function map_(destination, m, s) {
        for (var key in m) {
            const typeConstructor = m[key];
            switch (typeConstructor.name) {

                case 'Number':
                case 'String':
                case 'Boolean':
                case 'Object':
                case 'Array': {

                    const value = s && s[key] && Utils.isType(typeConstructor, s[key]) ? s[key]:  typeConstructor();

                    if (Utils.isType(Array, destination)) {
                        destination.push(value);
                    }
                    else {
                        destination[key] = value;
                    }
                    
                    break;
                }

                default: {

                    if (Utils.isType(Array, m[key]) && Utils.isType(Array, s[key])) {
                        destination[key] = [];
                        s[key].forEach((value) => {
                            map_(destination[key], m[key], value);
                        });
                    }
                    else {
                        destination[key] = {};
                        map_(destination[key], m[key], s[key]);
                    }
                    break;
                }
            }
            
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