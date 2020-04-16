'use strict';
const Utils = require('./utils');
const Errors = require('./errors');

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
                        errors.errorsRef.pushMissingProperty(key);
                    }
                    else {
                        const errorKey = Number.isInteger(+key) ? `${errors.key}[${key}]`: key;
                        errors.errorsRef.pushTypeMismatch(
                            errorKey,
                            valueTypeConstructor.name, 
                            source[key] === null ? 'null' : source[key].constructor.name
                        );
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
                        errors.errorsRef.pushMissingProperty(key);
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
    const errorsObject = Errors();
    const errors = {
        key: '',
        errorsRef: errorsObject
    };

    internals.mapFromSourceToSchema(result, errors, schema, source);

    return {
        result,
        errors: errorsObject.errors()
    };
};