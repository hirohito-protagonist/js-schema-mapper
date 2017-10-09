const Lab = require('lab');
const lab = exports.lab = Lab.script();

const describe = lab.describe;
const it = lab.it;
const expect = Lab.expect;

const Mapper = require('./../lib');

describe('Mapper', () => {

    it('should return schema with default values when source is different than literal object', (done) => {

        const person = Mapper.schema({
            name: String,
            tags: [{
                id: Number
            }]
        });
        const expected = {
            name: '',
            tags: []
        };
        expect(person.mapFromObject().result).to.equal(expected);
        expect(person.mapFromObject(null).result).to.equal(expected);
        expect(person.mapFromObject(true).result).to.equal(expected);
        expect(person.mapFromObject(1).result).to.equal(expected);
        expect(person.mapFromObject('').result).to.equal(expected);
        expect(person.mapFromObject(() => {}).result).to.equal(expected);
        expect(person.mapFromObject(new Date()).result).to.equal(expected);
        expect(person.mapFromObject(/[a-z]/).result).to.equal(expected);
        expect(person.mapFromObject([]).result).to.equal(expected);
        done();
    });

    it('should return empty literal object when source is object and schema is empty', (done) => {
        
        const person = Mapper.schema({});

        expect(person.mapFromObject({})).to.equal({
            result: {},
            errors: []
        });
        done();
    });

    it('should map schema definition when source is empty literal object', (done) => {
        
        const person = Mapper.schema({
            id: Number,
            name: String,
            surname: String,
            male: Boolean
        });

        expect(person.mapFromObject({}).result).to.equal({
            id: 0,
            name: '',
            surname: '',
            male: false
        });
        done();
    });

    it('should map from source properties that are defined only in schema', (done) => {
        
        const person = Mapper.schema({
            id: Number,
            name: String,
            surname: String,
            male: Boolean
        });

        expect(person.mapFromObject({
            name: 'Hiro',
            address: 'unknown'
        }).result).to.equal({
            id: 0,
            name: 'Hiro',
            surname: '',
            male: false
        });
        done();
    });

    it('should provide default data from schema when type mismatch is in provided source', (done) => {
        
        const person = Mapper.schema({
            id: Number,
            name: String,
            surname: String,
            male: Boolean
        });

        expect(person.mapFromObject({
            id: '123',
            name: 'Hiro',
            address: 'unknown',
            male: 1
        }).result).to.equal({
            id: 0,
            name: 'Hiro',
            surname: '',
            male: false
        });
        done();
    });

    it('should map Object as it is when is set in schema', (done) => {
        
        const person = Mapper.schema({
            id: Number,
            name: String,
            surname: String,
            male: Boolean,
            address: Object
        });

        expect(person.mapFromObject({
            id: '123',
            name: 'Hiro',
            address: {
                street: 'Metaverse'
            },
            male: 1
        }).result).to.equal({
            id: 0,
            name: 'Hiro',
            surname: '',
            male: false,
            address: {
                street: 'Metaverse'
            }
        });
        done();
    });

    it('should map Array as it is when is set in schema', (done) => {
        
        const person = Mapper.schema({
            id: Number,
            name: String,
            surname: String,
            male: Boolean,
            friends: Array
        });

        expect(person.mapFromObject({
            id: '123',
            name: 'Hiro',
            male: 1,
            friends: ['Tim', 'Joe']
        }).result).to.equal({
            id: 0,
            name: 'Hiro',
            surname: '',
            male: false,
            friends: ['Tim', 'Joe']
        });
        done();
    });



    describe('When map from collection', () => {

        it('should by default in result return empty collection when source is not collection', (done) => {


            const person = Mapper.schema({
                name: String,
                tags: [{
                    id: Number
                }]
            });
            expect(person.mapFromCollection().result).to.equal([]);
            expect(person.mapFromCollection(null).result).to.equal([]);
            expect(person.mapFromCollection(true).result).to.equal([]);
            expect(person.mapFromCollection(1).result).to.equal([]);
            expect(person.mapFromCollection('').result).to.equal([]);
            expect(person.mapFromCollection(() => {}).result).to.equal([]);
            expect(person.mapFromCollection(new Date()).result).to.equal([]);
            expect(person.mapFromCollection(/[a-z]/).result).to.equal([]);
            expect(person.mapFromCollection([]).result).to.equal([]);
            done();
        });

        it('should map and collect data', (done) => {
            
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

    describe('When nested schema definition', () => {

        it('should map with the provided source', (done) => {
            
            const person = Mapper.schema({
                id: Number,
                name: String,
                surname: String,
                male: Boolean,
                location: {
                    city: String,
                    country: String
                }
            });

            expect(person.mapFromObject({
                name: 'Hiro',
                location: {
                    city: 'Hope',
                    country: 'Freedom'
                }
            }).result).to.equal({
                id: 0,
                name: 'Hiro',
                surname: '',
                male: false,
                location: {
                    city: 'Hope',
                    country: 'Freedom'
                }
            });

            done();
        });

        it('should provide default default object from schema when in source matched object is empty', (done) => {
            
            const person = Mapper.schema({
                id: Number,
                name: String,
                surname: String,
                male: Boolean,
                location: {
                    city: String,
                    country: String
                }
            });
    
            expect(person.mapFromObject({
                name: 'Hiro',
                location: {}
            }).result).to.equal({
                id: 0,
                name: 'Hiro',
                surname: '',
                male: false,
                location: {
                    city: '',
                    country: ''
                }
            });
    
            done();
        });

        it('should provide default object from schema when in source matched object is null', (done) => {
            
            const person = Mapper.schema({
                id: Number,
                name: String,
                surname: String,
                male: Boolean,
                location: {
                    city: String,
                    country: String
                }
            });
    
            expect(person.mapFromObject({
                name: 'Hiro',
                location: null
            }).result).to.equal({
                id: 0,
                name: 'Hiro',
                surname: '',
                male: false,
                location: {
                    city: '',
                    country: ''
                }
            });
    
            done();
        });

        it('should provide default object from schema when in source matched object is not defined', (done) => {
            
            const person = Mapper.schema({
                id: Number,
                name: String,
                surname: String,
                male: Boolean,
                location: {
                    city: String,
                    country: String
                }
            });
    
            expect(person.mapFromObject({
                name: 'Hiro'
            }).result).to.equal({
                id: 0,
                name: 'Hiro',
                surname: '',
                male: false,
                location: {
                    city: '',
                    country: ''
                }
            });
    
            done();
        });
    });

    describe('When nested collection schema definition', () => {

        it('should collect primitives values', (done) => {

            const person = Mapper.schema({
                id: Number,
                name: String,
                surname: String,
                tags: [String]
            });

            expect(person.mapFromObject({
                name: 'Hiro',
                tags: ['a', 'b', 'c']
            }).result).to.equal({
                id: 0,
                name: 'Hiro',
                surname: '',
                tags: ['a', 'b', 'c']
            });

            done();
        });

        it('should for mixed type array values provide default type value defined in schema', (done) => {
            
            const person = Mapper.schema({
                id: Number,
                name: String,
                surname: String,
                tags: [String]
            });

            expect(person.mapFromObject({
                name: 'Hiro',
                tags: ['a', true, 'c', 1]
            }).result).to.equal({
                id: 0,
                name: 'Hiro',
                surname: '',
                tags: ['a', '', 'c', '']
            });

            done();
        });

        it('should return empty array when in source matched property is not array', (done) => {
            
            const person = Mapper.schema({
                tags: [String]
            });

            expect(person.mapFromObject({}).result).to.equal({
                tags: []
            });

            expect(person.mapFromObject({
                tags: null
            }).result).to.equal({
                tags: []
            });
            done();
        });

        it('should collect objects', (done) => {
            
            const person = Mapper.schema({
                tags: [{
                    id: Number,
                    value: String
                }]
            });

            expect(person.mapFromObject({
                tags: [
                    { id: 1, value: 'a' },
                    { id: 2, value: 'b' }
                ]
            }).result).to.equal({
                tags: [
                    { id: 1, value: 'a' },
                    { id: 2, value: 'b' }
                ]
            });
            done();
        });
    });

    it('should collect deep array schema definitions', (done) => {
        
        const person = Mapper.schema({
            tags: [{
                id: Number,
                value: [{
                    name: String
                }]
            }]
        });

        expect(person.mapFromObject({
            tags: [
                { 
                    id: 1,
                    value: [ { name: 'a' }, { name : 'b'} ]
                }
            ]
        }).result).to.equal({
            tags: [
                { 
                    id: 1,
                    value:  [ { name: 'a' }, { name : 'b'} ]
                }
            ]
        });
        done();
    });

    describe('When mapping errors', () => {

        it('should collect unmatched type information', (done) => {

            const person = Mapper.schema({
                id: Number,
                name: String,
                surname: String,
                tags: [Boolean]
            });

            expect(person.mapFromObject({
                id: '1',
                name: 12,
                surname: false,
                tags: ['a']
            }).errors).to.equal([
                '<id> property expected to be a Number but it was String',
                '<name> property expected to be a String but it was Number',
                '<surname> property expected to be a String but it was Boolean',
                '<tags[0]> property expected to be a Boolean but it was String'
            ]);
            done();
        });

        it('should collect missing property type information', (done) => {
            
            const person = Mapper.schema({
                id: Number,
                name: String,
                surname: String,
                tags: [Boolean]
            });

            expect(person.mapFromObject({}).errors).to.equal([
                '<id> property is missing',
                '<name> property is missing',
                '<surname> property is missing',
                '<tags> property is missing'
            ]);
            done();
        });
    });

    describe('When map', () => {

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

        it('should collect fom object source', (done) => {
            
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
