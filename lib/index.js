
const Utils = require('./utils');

const internals = {};

internals.mapFromSourceToSchema = (result, schema, source) => {
    
    for (var key in schema) {
        const valueTypeConstructor = schema[key];
        switch (valueTypeConstructor.name) {

            case 'Number':
            case 'String':
            case 'Boolean':
            case 'Object':
            case 'Array': {

                const value = source && source[key] && Utils.isType(valueTypeConstructor, source[key]) ? source[key]:  valueTypeConstructor();

                if (Utils.isType(Array, result)) {
                    result.push(value);
                }
                else {
                    result[key] = value;
                }
                
                break;
            }

            default: {

                if (Utils.isType(Array, schema[key]) && Utils.isType(Array, source[key])) {
                    result[key] = [];
                    source[key].forEach((value) => {
                        internals.mapFromSourceToSchema(result[key], schema[key], value);
                    });
                }
                else {
                    result[key] = {};
                    internals.mapFromSourceToSchema(result[key], schema[key], source[key]);
                }
                break;
            }
        }
        
    }
};

internals.map = (schema, source) => {

    const result = {};

    internals.mapFromSourceToSchema(result, schema, source);

    return result;
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