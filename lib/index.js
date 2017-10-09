'use strict';

const Utils = require('./utils');
const Mapper = require('./mapper');

const internals = {};

internals.mapFromCollection = (schema, source) => {

    const input = Utils.isType(Array, source) ? source : [];

    return input.reduce((output, obj) => {
            
        const { result, errors } = internals.mapFromObject(schema, obj);
        output.result.push(result);
        output.errors = output.errors.concat(errors);
        return output;
    }, {
        result: [],
        errors: []
    });     
};

internals.mapFromObject = (schema, source) => {

    return [Mapper(schema, source)].reduce((output, obj) => {
        
        output.result = obj.result;
        output.errors = obj.errors;
        return output;
    }, {
        result: {},
        errors: []
    });
};

internals.schema = (schema) => {

    return {
        mapFromCollection: (source) => {

            return internals.mapFromCollection(schema, source);
        },
        mapFromObject: (source) => {
        
            return internals.mapFromObject(schema, source);
        },
        map: (source) => {

            const out = Utils.isType(Array, source) ? 
                internals.mapFromCollection(schema, source) :
                internals.mapFromObject(schema, source)

            return {
                result: [].concat(out.result),
                errors: [].concat(out.errors)
            } 
        }
    };
};

module.exports = {
    schema: internals.schema
};
