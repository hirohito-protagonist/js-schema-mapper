const Lab = require('lab');
const lab = exports.lab = Lab.script();

const describe = lab.describe;
const it = lab.it;
const expect = Lab.expect;

const Mapper = require('./../lib');

describe('API', () => {

    describe('mapFromObject', () => {
        
        it('should provide default schema result when the source is primitive value', (done) => {

            const person = Mapper.schema({
                name: String
            });
    
            expect(person.mapFromObject(123)).to.equal({
                result: { name: '' },
                errors: [
                    '<name> property is missing'
                ]
            });
            done();
        });

        it('should collect from object source', (done) => {
            
            const person = Mapper.schema({
                name: String
            });
    
            expect(person.mapFromObject(
                { name: 123 }
            )).to.equal({
                result: { name: '' },
                errors: [
                    '<name> property expected to be a String but it was Number'
                ]
            });
            done();
        });
    });

    describe('mapFromCollection', () => {

        it('should provide empty array result when the source is primitive value', (done) => {

            const person = Mapper.schema({
                name: String
            });
    
            expect(person.mapFromCollection(123)).to.equal({
                result: [],
                errors: []
            });
            done();
        });

        it('should collect fom collection source', (done) => {

            const person = Mapper.schema({
                name: String
            });
    
            expect(person.mapFromCollection([
                { name: 'Hiro' },
                { name: 123 }
            ])).to.equal({
                result: [
                    { name: 'Hiro' },
                    { name: '' }
                ],
                errors: [
                    '<name> property expected to be a String but it was Number'
                ]
            });
            done();
        });
    });

    describe('map', () => {

        it('should provide default schema result when the source is primitive value', (done) => {

            const person = Mapper.schema({
                name: String
            });
    
            expect(person.map(123)).to.equal({
                result: [
                    { name: '' }
                ],
                errors: [
                    '<name> property is missing'
                ]
            });
            done();
        });

        it('should collect fom collection source', (done) => {

            const person = Mapper.schema({
                name: String
            });
    
            expect(person.map([
                { name: 'Hiro' },
                { name: 123 }
            ])).to.equal({
                result: [
                    { name: 'Hiro' },
                    { name: '' }
                ],
                errors: [
                    '<name> property expected to be a String but it was Number'
                ]
            });
            done();
        });

        it('should collect from object source', (done) => {
            
            const person = Mapper.schema({
                name: String
            });
    
            expect(person.map(
                { name: 123 }
            )).to.equal({
                result: [
                    { name: '' }
                ],
                errors: [
                    '<name> property expected to be a String but it was Number'
                ]
            });
            done();
        });
    });
});
