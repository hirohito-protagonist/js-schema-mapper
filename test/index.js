const Lab = require('lab');
const lab = exports.lab = Lab.script();

const describe = lab.describe;
const it = lab.it;
const expect = Lab.expect;

const Mapper = require('./../lib');

describe('Mapper', () => {

    it('should return null when source is different than literal object', (done) => {

        const person = Mapper.schema({});
        expect(person.map()).to.equal(null);
        expect(person.map(null)).to.equal(null);
        expect(person.map(true)).to.equal(null);
        expect(person.map(1)).to.equal(null);
        expect(person.map('')).to.equal(null);
        expect(person.map(() => {})).to.equal(null);
        expect(person.map(new Date())).to.equal(null);
        expect(person.map(/[a-z]/)).to.equal(null);
        expect(person.map([])).to.equal(null);
        done();
    });

    it('should return empty literal object when source is object and schema is empty', (done) => {
        
        const person = Mapper.schema({});

        expect(person.map({})).to.equal({});
        done();
    });

    it('should map schema defintion when soruce is empty literal object', (done) => {
        
        const person = Mapper.schema({
            id: Number,
            name: String,
            surname: String,
            male: Boolean
        });

        expect(person.map({})).to.equal({
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

        expect(person.map({
            name: 'Hiro',
            address: 'unknown'
        })).to.equal({
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

        expect(person.map({
            id: '123',
            name: 'Hiro',
            address: 'unknown',
            male: 1
        })).to.equal({
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

        expect(person.map({
            id: '123',
            name: 'Hiro',
            address: {
                street: 'Metaverse'
            },
            male: 1
        })).to.equal({
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

        expect(person.map({
            id: '123',
            name: 'Hiro',
            male: 1,
            friends: ['Tim', 'Joe']
        })).to.equal({
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

            expect(person.map({
                name: 'Hiro',
                location: {
                    city: 'Hope',
                    country: 'Freedom'
                }
            })).to.equal({
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

        it('should provide defualt default object from schema when in source mtached object is empty', (done) => {
            
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
    
            expect(person.map({
                name: 'Hiro',
                location: {}
            })).to.equal({
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

        it('should provide defualt object from schema when in source mtached object is null', (done) => {
            
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
    
            expect(person.map({
                name: 'Hiro',
                location: null
            })).to.equal({
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

        it('should provide defualt object from schema when in source mtached object is not defined', (done) => {
            
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
    
            expect(person.map({
                name: 'Hiro'
            })).to.equal({
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

            expect(person.map({
                name: 'Hiro',
                tags: ['a', 'b', 'c']
            })).to.equal({
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

            expect(person.map({
                name: 'Hiro',
                tags: ['a', true, 'c', 1]
            })).to.equal({
                id: 0,
                name: 'Hiro',
                surname: '',
                tags: ['a', '', 'c', '']
            });

            done();
        });

        it('should return empty array when in soruce matched property is not array', (done) => {
            
            const person = Mapper.schema({
                tags: [String]
            });

            expect(person.map({})).to.equal({
                tags: []
            });

            expect(person.map({
                tags: null
            })).to.equal({
                tags: []
            });
            done();
        });
    });
});
