'use strict';
const Utils = require('./utils');

const internals = {};

internals.errorMessage = {
    missingProperty: (key) => `<${key}> property is missing`,
    typeMismatch: (key, expectedType, providedType) => `<${key}> property expected to be a ${expectedType} but it was ${providedType}`
};

internals.mapFromSourceToSchema = (result, errors, schema, source) => {

    Object.keys(schema).forEach((key) => {
    
        const valueTypeConstructor = schema[key];
        switch (valueTypeConstructor.name) {

            case 'Number':
            case 'String':
            case 'Boolean':
            case 'Object':
            case 'Array': {

                const isExpectedType = source ? 
                    Utils.isType(String, source) || Utils.isType(Number, source) || Utils.isType(Boolean, source) ? 
                        Utils.isType(valueTypeConstructor, source)  : Utils.isType(valueTypeConstructor, source[key]) 
                        : false;

                const value = isExpectedType ? 
                    Utils.isType(String, source) || Utils.isType(Number, source) || Utils.isType(Boolean, source) ? 
                        source : source[key]:  valueTypeConstructor();

                if (Utils.isType(Array, result)) {
                    result.push(value);
                }
                else {
                    result[key] = value;
                }

                if (!isExpectedType) {
                    if (!source || typeof source[key] === 'undefined') {
                        errors.stack.push(internals.errorMessage.missingProperty(key));
                    }
                    else {
                        const errorKey = Number.isInteger(+key) ? `${errors.key}[${key}]`: key;
                        errors.stack.push(internals.errorMessage.typeMismatch(errorKey, valueTypeConstructor.name, source[key].constructor.name));
                    }
                }
                break;
            }

            default: {
                errors.key = key;
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
                        errors.stack.push(internals.errorMessage.missingProperty(key));
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

module.exports = (schema, source) => {

    const result = {};
    const errors = {
        key: '',
        stack: []
    };

    internals.mapFromSourceToSchema(result, errors, schema, source);

    return {
        result,
        errors: errors.stack
    };
};