
const Utils = require('./utils');

const internals = {};

internals.mapFromSourceToSchema = (result, errors, schema, source) => {

    Object.keys(schema).forEach((key) => {
	
        const valueTypeConstructor = schema[key];
        switch (valueTypeConstructor.name) {

            case 'Number':
            case 'String':
            case 'Boolean':
            case 'Object':
            case 'Array': {

                const isExpectedType = source && Utils.isType(valueTypeConstructor, source[key]);

                const value = isExpectedType ? source[key]:  valueTypeConstructor();

                if (Utils.isType(Array, result)) {
                    result.push(value);
                }
                else {
                    result[key] = value;
                }

                if (!isExpectedType) {
                    if (!source || typeof source[key] === 'undefined') {
                        errors.push(`<${key}> property is missing`);
                    }
                    else {
                        errors.push(`<${key}> property expected to be a ${valueTypeConstructor.name} but it was ${source[key].constructor.name}`);
                    }
                }
                break;
            }

            default: {

                if (Utils.isType(Array, result)) {
                    const arrayObject = {};
                    internals.mapFromSourceToSchema(arrayObject, errors, schema[key], source);
                    result.push(arrayObject);
                }
                else if (Utils.isType(Array, schema[key])) {
                    result[key] = [];
                    const sourceIsArray = source && Utils.isType(Array, source[key]); 
                    const sourceArr = sourceIsArray ? source[key] : [];
                    if (!sourceIsArray) {
                        errors.push(`<${key}> property is missing`);
                    }
                    sourceArr.forEach((value) => {
                        internals.mapFromSourceToSchema(result[key], errors, schema[key], value);
                    });
                }
                else {
                    result[key] = {};
                    internals.mapFromSourceToSchema(result[key], errors, schema[key], source[key]);
                }
                break;
            }
        }
        
    });
};

internals.map = (schema, source) => {

    const result = {};
    const errors = [];

    internals.mapFromSourceToSchema(result, errors, schema, source);

    return {
        result,
        errors
    };
};

internals.schema = (schema) => {

    return {
        map: (source) => {
	    
            return Utils.isType(Array, source) ? 
                source.reduce((output, obj) => {
                
                    const { result, errors } = internals.map(schema, obj);
                    output.result.push(result);
                    output.errors = output.errors.concat(errors);
                    return output;
                }, {
                    isCollection: true,
                    result: [],
                    errors: []
                }) 
                : 
                [internals.map(schema, source)].reduce((output, obj) => {

                    output.result = obj.result;
                    output.errors = obj.errors;
                    return output;
                }, {
                    isCollection: false,
                    result: {},
                    errors: []
                });
        }
    };
};

module.exports = {
    schema: internals.schema
};
