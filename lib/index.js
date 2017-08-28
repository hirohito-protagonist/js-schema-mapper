
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

                if (Utils.isType(Array, result)) {
                    const arrayObject = {};
                    internals.mapFromSourceToSchema(arrayObject, schema[key], source);
                    result.push(arrayObject);
                }
                else if (Utils.isType(Array, schema[key])) {
                    result[key] = [];
                    const sourceArr = source && Utils.isType(Array, source[key]) ? source[key] : []; 
                    sourceArr.forEach((value) => {
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

            return internals.map(schema, source);
        }
    };
};

module.exports = {
    schema: internals.schema
};