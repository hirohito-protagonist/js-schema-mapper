const { expect } = require('code');
const Lab = require('lab');
const { describe, it } = exports.lab = Lab.script();

const Mapper = require('./../lib');

describe('API', () => {

    describe('mapFromObject', () => {
        
        it('should provide default schema result when the source is primitive value', () => {

            // Given
            const person = Mapper.schema({
                name: String
            });

            // When
            const result = person.mapFromObject(123);
    
            // Then
            expect(result).to.equal({
                result: { name: '' },
                errors: [
                    '<name> property is missing'
                ]
            });
        });

        it('should collect from object source', () => {
            
            // Given
            const person = Mapper.schema({
                name: String
            });
    
            // When
            const result = person.mapFromObject(
                { name: 123 }
            );

            // Then
            expect(result).to.equal({
                result: { name: '' },
                errors: [
                    '<name> property expected to be a String but it was Number'
                ]
            });
        });
    });

    describe('mapFromCollection', () => {

        it('should provide empty array result when the source is primitive value', () => {

            // Given
            const person = Mapper.schema({
                name: String
            });

            // When
            const result = person.mapFromCollection(123);
    
            // Then
            expect(result).to.equal({
                result: [],
                errors: []
            });
        });

        it('should collect fom collection source', () => {

            // Given
            const person = Mapper.schema({
                name: String
            });

            // When
            const result = person.mapFromCollection([
                { name: 'Hiro' },
                { name: 123 }
            ]);
    
            // Then
            expect(result).to.equal({
                result: [
                    { name: 'Hiro' },
                    { name: '' }
                ],
                errors: [
                    '<name> property expected to be a String but it was Number'
                ]
            });
        });
    });

    describe('map', () => {

        it('should provide default schema result when the source is primitive value', () => {

            // Given
            const person = Mapper.schema({
                name: String
            });

            // When
            const result = person.map(123);
    
            // Then
            expect(result).to.equal({
                result: [
                    { name: '' }
                ],
                errors: [
                    '<name> property is missing'
                ]
            });
        });

        it('should collect fom collection source', () => {

            // Given
            const person = Mapper.schema({
                name: String
            });

            // When
            const result = person.map([
                { name: 'Hiro' },
                { name: 123 }
            ]);
    
            // Then
            expect(result).to.equal({
                result: [
                    { name: 'Hiro' },
                    { name: '' }
                ],
                errors: [
                    '<name> property expected to be a String but it was Number'
                ]
            });
        });

        it('should collect from object source', () => {
            
            // Given
            const person = Mapper.schema({
                name: String
            });

            // When
            const result = person.map(
                { name: 123 }
            );
    
            // Then
            expect(result).to.equal({
                result: [
                    { name: '' }
                ],
                errors: [
                    '<name> property expected to be a String but it was Number'
                ]
            });
        });
    });
});
