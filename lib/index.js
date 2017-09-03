
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
        isCollection: false,
        result,
        errors
    };
};

internals.schema = (schema) => {

    return {
        map: (source) => {

            if (Utils.isType(Array, source)) {

                let errors = [];
                const result = source.map((value) => {

                    const obj = internals.map(schema, value);

                    errors = errors.concat(obj.errors);
                    return obj.result;
                });
		
                return {
                    isCollection: true,
                    result,
                    errors
                };
            }
	    
            return internals.map(schema, source);
        }
    };
};

module.exports = {
    schema: internals.schema
};
