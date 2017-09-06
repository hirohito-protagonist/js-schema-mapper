'use strict';

const Utils = require('./utils');
const Mapper = require('./mapper');

const internals = {};

internals.schema = (schema) => {

    return {
        map: (source) => {
	    
            return Utils.isType(Array, source) ? 
                source.reduce((output, obj) => {
                
                    const { result, errors } = Mapper(schema, obj);
                    output.result.push(result);
                    output.errors = output.errors.concat(errors);
                    return output;
                }, {
                    isCollection: true,
                    result: [],
                    errors: []
                }) 
                : 
                [Mapper(schema, source)].reduce((output, obj) => {

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
