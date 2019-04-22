const { expect } = require('@hapi/code');
const Lab = require('@hapi/lab');
const { describe, it } = exports.lab = Lab.script();

const Utils = require('./../lib/utils');

describe('Utils', () => {

    describe('isType', () => {

        [
            { type: String, value: '' },
            { type: Boolean, value: true },
            { type: Number, value: 0 },
            { type: Object, value: {} },
            { type: Array, value: [] },
            { type: Function, value: function () {} },
            { type: Function, value: () => {} },
            { type: RegExp, value: /([A-z])/ },
            { type: Date, value: new Date() },
        ].forEach((testData) => {

            it(`should works with built-in type: ${testData.type.name}`, () => {

                // Given
                const { type, value } = testData;

                // When
                const result = Utils.isType(type, value);

                // Then
                expect(result).to.equal(true);
            });
        });


        [
            { type: String, value: new String('') },
            { type: Boolean, value: new Boolean() },
            { type: Number, value: new Number() },
            { type: Object, value: new Object() },
            { type: Array, value: new Array() },
            { type: Function, value: new Function() },
            { type: RegExp, value: new RegExp(/([A-z])/) },
            { type: Date, value: new Date() }
        ].forEach((testData) => {

            it(`should works with type constructor ${testData.type.name}`, () => {
            
                // Given
                const { type, value } = testData;

                // When
                const result = Utils.isType(type, value);

                // Then
                expect(result).to.equal(true);
            });
        });

        it('should not coerce', () => {
            
            expect(Utils.isType(Boolean, 1)).to.equal(false);
            expect(Utils.isType(Number, '1')).to.equal(false);
            expect(Utils.isType(Number, false)).to.equal(false);
        });

        it('should not consider primitives to be instance of Object', () => {
            
            expect(Utils.isType(Object, false)).to.equal(false);
            expect(Utils.isType(Object, 0)).to.equal(false);
            expect(Utils.isType(Object, '')).to.equal(false);
        });

        [
            String,
            Boolean,
            Number,
            Object,
            Array,
            Function,
            RegExp,
            Date
        ].forEach((typeConstructor) => {

            it(`should not match ${typeConstructor.name} for null`, () => {

                // Given
                const type = typeConstructor;
                const value = null;

                // When
                const result = Utils.isType(type, value);

                // Then
                expect(result).to.equal(false);
            });

            it(`should not match ${typeConstructor.name} for undefined`, () => {

                // Given
                const type = typeConstructor;
                const value = void(0);

                // When
                const result = Utils.isType(type, value);

                // Then
                expect(result).to.equal(false);
            });
        });
    });
});