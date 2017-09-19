'use strict';

const Utils = require('./utils');
const Mapper = require('./mapper');

const internals = {};

internals.mapFromCollection = (schema, source) => {

    const input = Utils.isType(Array, source) ? source : [];

    return input.reduce((output, obj) => {
            
        const { result, errors } = internals.map(schema, obj);
        output.result.push(result);
        output.errors = output.errors.concat(errors);
        return output;
    }, {
        result: [],
        errors: []
    });     
};

internals.map = (schema, source) => {

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
        map: (source) => {
        
            return internals.map(schema, source);
        }
    };
};

module.exports = {
    schema: internals.schema
};
