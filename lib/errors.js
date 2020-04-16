
const internals = {};

internals.errorMessage = {
    missingProperty: (key) => `<${key}> property is missing`,
    typeMismatch: (key, expectedType, providedType) => `<${key}> property expected to be a ${expectedType} but it was ${providedType}`
};

module.exports = () => {

    const stack = [];

    return {
        pushMissingProperty: (key) => stack.push(internals.errorMessage.missingProperty(key)),
        pushTypeMismatch: (key, expectedType, providedType) => stack.push(internals.errorMessage.typeMismatch(key, expectedType, providedType)),
        errors: () => [...stack]
    };
};

