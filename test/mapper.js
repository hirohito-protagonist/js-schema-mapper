const Lab = require('lab');
const lab = exports.lab = Lab.script();

const describe = lab.describe;
const it = lab.it;
const expect = Lab.expect;

const Mapper = require('./../lib/mapper');

describe('Mapper', () => {

    it('should return schema with default values when source is different than literal object', (done) => {
        
        const schema = {
            name: String,
            tags: [{
                id: Number
            }]
        };
        const expected = {
            name: '',
            tags: []
        };
        expect(Mapper(schema).result).to.equal(expected);
        expect(Mapper(schema, null).result).to.equal(expected);
        expect(Mapper(schema, true).result).to.equal(expected);
        expect(Mapper(schema, 1).result).to.equal(expected);
        expect(Mapper(schema, '').result).to.equal(expected);
        expect(Mapper(schema, () => {}).result).to.equal(expected);
        expect(Mapper(schema, new Date()).result).to.equal(expected);
        expect(Mapper(schema, /[a-z]/).result).to.equal(expected);
        expect(Mapper(schema, []).result).to.equal(expected);
        done();
    });

    it('should return empty literal object when source is object and schema is empty', (done) => {
        
        expect(Mapper({}, {})).to.equal({
            result: {},
            errors: []
        });
        done();
    });

    it('should map schema definition when source is empty literal object', (done) => {
        
        const schema = {
            id: Number,
            name: String,
            surname: String,
            male: Boolean
        };

        expect(Mapper(schema, {}).result).to.equal({
            id: 0,
            name: '',
            surname: '',
            male: false
        });
        done();
    });

    it('should map from source properties that are defined only in schema', (done) => {
        
        const schema = {
            id: Number,
            name: String,
            surname: String,
            male: Boolean
        };

        expect(Mapper(schema, {
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
        
        const schema = {
            id: Number,
            name: String,
            surname: String,
            male: Boolean
        };

        expect(Mapper(schema, {
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
        
        const schema = {
            id: Number,
            name: String,
            surname: String,
            male: Boolean,
            address: Object
        };

        expect(Mapper(schema, {
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
        
        const schema = {
            id: Number,
            name: String,
            surname: String,
            male: Boolean,
            friends: Array
        };

        expect(Mapper(schema, {
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

    describe('When nested schema definition', () => {
        
        it('should map with the provided source', (done) => {
            
            const schema = {
                id: Number,
                name: String,
                surname: String,
                male: Boolean,
                location: {
                    city: String,
                    country: String
                }
            };

            expect(Mapper(schema, {
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

        it('should provide default object from schema when in source matched object is empty', (done) => {
            
            const schema = {
                id: Number,
                name: String,
                surname: String,
                male: Boolean,
                location: {
                    city: String,
                    country: String
                }
            };
    
            expect(Mapper(schema, {
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
            
            const schema = {
                id: Number,
                name: String,
                surname: String,
                male: Boolean,
                location: {
                    city: String,
                    country: String
                }
            };
    
            expect(Mapper(schema, {
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
            
            const schema = {
                id: Number,
                name: String,
                surname: String,
                male: Boolean,
                location: {
                    city: String,
                    country: String
                }
            };
    
            expect(Mapper(schema, {
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

            const schema = {
                id: Number,
                name: String,
                surname: String,
                tags: [String]
            };

            expect(Mapper(schema, {
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
            
            const schema = {
                id: Number,
                name: String,
                surname: String,
                tags: [String]
            };

            expect(Mapper(schema, {
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
            
            const schema = {
                tags: [String]
            };

            expect(Mapper(schema, {}).result).to.equal({
                tags: []
            });

            expect(Mapper(schema, {
                tags: null
            }).result).to.equal({
                tags: []
            });
            done();
        });

        it('should collect objects', (done) => {
            
            const schema = {
                tags: [{
                    id: Number,
                    value: String
                }]
            };

            expect(Mapper(schema, {
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
        
        const schema = {
            tags: [{
                id: Number,
                value: [{
                    name: String
                }]
            }]
        };

        expect(Mapper(schema, {
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

    describe('When errors on mapping', () => {
        
        it('should collect unmatched type information', (done) => {

            const schema = {
                id: Number,
                name: String,
                surname: String,
                tags: [Boolean]
            };

            expect(Mapper(schema, {
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
            
            const schema = {
                id: Number,
                name: String,
                surname: String,
                tags: [Boolean]
            };

            expect(Mapper(schema, {}).errors).to.equal([
                '<id> property is missing',
                '<name> property is missing',
                '<surname> property is missing',
                '<tags> property is missing'
            ]);
            done();
        });
    });
});