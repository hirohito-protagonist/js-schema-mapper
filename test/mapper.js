const { expect } = require('@hapi/code');
const Lab = require('@hapi/lab');
const { describe, it } = exports.lab = Lab.script();

const Mapper = require('./../lib/mapper');

describe('Mapper', () => {

    [
        void(0),
        null,
        true,
        1,
        '',
        () => {},
        new Date(),
        /[a-z]/,
        []
    ].forEach((testData, index) => {

        it(`Case ${index + 1}: should return schema with default values when source is different than literal object`, () => {
        
            // Given
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

            // When
            const { result } = Mapper(schema, testData);

            //Then
            expect(result).to.equal(expected);
        });
    });


    it('should return empty literal object when source is object and schema is empty', () => {

        // Given
        const schema = {};
        const source = {};

        // When
        const result = Mapper(schema, source);

        // Then
        expect(result).to.equal({
            result: {},
            errors: []
        });
    });

    it('should map schema definition when source is empty literal object', () => {
        
        // Given
        const schema = {
            id: Number,
            name: String,
            surname: String,
            male: Boolean
        };
        const source = {};

        // When
        const { result } = Mapper(schema, source);

        // Then
        expect(result).to.equal({
            id: 0,
            name: '',
            surname: '',
            male: false
        });
    });

    it('should map from source properties that are defined only in schema', () => {
        
        // Given
        const schema = {
            id: Number,
            name: String,
            surname: String,
            male: Boolean
        };
        const source = {
            name: 'Hiro',
            address: 'unknown'
        };

        // When
        const { result } = Mapper(schema, source);

        // Then
        expect(result).to.equal({
            id: 0,
            name: 'Hiro',
            surname: '',
            male: false
        });
    });

    it('should provide default data from schema when type mismatch is in provided source', () => {
        
        // Given
        const schema = {
            id: Number,
            name: String,
            surname: String,
            male: Boolean
        };
        const source = {
            id: '123',
            name: 'Hiro',
            address: 'unknown',
            male: 1
        };

        // When
        const { result } = Mapper(schema, source);

        // Then
        expect(result).to.equal({
            id: 0,
            name: 'Hiro',
            surname: '',
            male: false
        });
    });

    it('should map Object as it is when is set in schema', () => {
        
        // Given
        const schema = {
            id: Number,
            name: String,
            surname: String,
            male: Boolean,
            address: Object
        };
        const source = {
            id: '123',
            name: 'Hiro',
            address: {
                street: 'Metaverse'
            },
            male: 1
        };

        // When
        const { result } = Mapper(schema, source);

        // Then
        expect(result).to.equal({
            id: 0,
            name: 'Hiro',
            surname: '',
            male: false,
            address: {
                street: 'Metaverse'
            }
        });
    });

    it('should map Array as it is when is set in schema', () => {
        
        // Given
        const schema = {
            id: Number,
            name: String,
            surname: String,
            male: Boolean,
            friends: Array
        };
        const source = {
            id: '123',
            name: 'Hiro',
            male: 1,
            friends: ['Tim', 'Joe']
        };

        // When
        const { result } = Mapper(schema, source);

        // Then
        expect(result).to.equal({
            id: 0,
            name: 'Hiro',
            surname: '',
            male: false,
            friends: ['Tim', 'Joe']
        });
    });

    describe('When nested schema definition', () => {
        
        it('should map with the provided source', () => {
            
            // Given
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
            const source = {
                name: 'Hiro',
                location: {
                    city: 'Hope',
                    country: 'Freedom'
                }
            };

            // When
            const { result } = Mapper(schema, source);

            // Then
            expect(result).to.equal({
                id: 0,
                name: 'Hiro',
                surname: '',
                male: false,
                location: {
                    city: 'Hope',
                    country: 'Freedom'
                }
            });
        });

        it('should provide default object from schema when in source matched object is empty', () => {
            
            // Given
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
            const source = {
                name: 'Hiro',
                location: {}
            };

            // When
            const { result } = Mapper(schema, source);
    
            // Then
            expect(result).to.equal({
                id: 0,
                name: 'Hiro',
                surname: '',
                male: false,
                location: {
                    city: '',
                    country: ''
                }
            });
        });

        it('should provide default object from schema when in source matched object is null', () => {
            
            // Given
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
            const source = {
                name: 'Hiro',
                location: null
            };
    
            // When
            const { result } = Mapper(schema, source);

            // Then
            expect(result).to.equal({
                id: 0,
                name: 'Hiro',
                surname: '',
                male: false,
                location: {
                    city: '',
                    country: ''
                }
            });
        });

        it('should provide default object from schema when in source matched object is not defined', () => {
            
            // Given
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
            const source = {
                name: 'Hiro'
            };

            // When
            const { result } = Mapper(schema, source);
    
            // Then
            expect(result).to.equal({
                id: 0,
                name: 'Hiro',
                surname: '',
                male: false,
                location: {
                    city: '',
                    country: ''
                }
            });
        });
    });

    describe('When nested collection schema definition', () => {
        
        describe('When String collections', () => {
            
            it('should collect primitives values', () => {

                // Given
                const schema = {
                    id: Number,
                    name: String,
                    surname: String,
                    tags: [String]
                };
                const source = {
                    name: 'Hiro',
                    tags: ['a', 'b', 'katana']
                };
    
                // When
                const { result } = Mapper(schema, source);
    
                // Then
                expect(result).to.equal({
                    id: 0,
                    name: 'Hiro',
                    surname: '',
                    tags: ['a', 'b', 'katana']
                });
            });
    
            it('should for mixed type array values provide default type value defined in schema', () => {
                
                // Given
                const schema = {
                    id: Number,
                    name: String,
                    surname: String,
                    tags: [String]
                };
                const source = {
                    name: 'Hiro',
                    tags: ['a', true, 'katana', 1]
                };
    
                // When
                const { result } = Mapper(schema, source);
    
                // Then
                expect(result).to.equal({
                    id: 0,
                    name: 'Hiro',
                    surname: '',
                    tags: ['a', '', 'katana', '']
                });
            });
        });

        describe('When Number collections', () => {
            
            it('should collect primitives values', () => {

                // Given
                const schema = {
                    id: Number,
                    name: String,
                    surname: String,
                    tags: [Number]
                };
                const source = {
                    name: 'Hiro',
                    tags: [14, 1, 20]
                };
    
                // When
                const { result } = Mapper(schema, source);
    
                // Then
                expect(result).to.equal({
                    id: 0,
                    name: 'Hiro',
                    surname: '',
                    tags: [14, 1, 20]
                });
            });
    
            it('should for mixed type array values provide default type value defined in schema', () => {
                
                // Given
                const schema = {
                    id: Number,
                    name: String,
                    surname: String,
                    tags: [Number]
                };
                const source = {
                    name: 'Hiro',
                    tags: ['a', true, 'katana', 1]
                };
    
                // When
                const { result } = Mapper(schema, source);
    
                // Then
                expect(result).to.equal({
                    id: 0,
                    name: 'Hiro',
                    surname: '',
                    tags: [0, 0, 0, 1]
                });
            });
        });

        describe('When Boolean collections', () => {
            
            it('should collect primitives values', () => {

                // Given
                const schema = {
                    id: Number,
                    name: String,
                    surname: String,
                    tags: [Boolean]
                };
                const source = {
                    name: 'Hiro',
                    tags: [true, false, true]
                };
    
                // When
                const { result } = Mapper(schema, source);
    
                // Then
                expect(result).to.equal({
                    id: 0,
                    name: 'Hiro',
                    surname: '',
                    tags: [true, false, true]
                });
            });
    
            it('should for mixed type array values provide default type value defined in schema', () => {
                
                // Given
                const schema = {
                    id: Number,
                    name: String,
                    surname: String,
                    tags: [Boolean]
                };
                const source = {
                    name: 'Hiro',
                    tags: ['a', true, 'katana', 1]
                };
    
                // When
                const { result } = Mapper(schema, source);
    
                // Then
                expect(result).to.equal({
                    id: 0,
                    name: 'Hiro',
                    surname: '',
                    tags: [false, true, false, false]
                });
            });
        });

        it('should return empty array when in source matched property is null', () => {
            
            // Given
            const schema = {
                tags: [String]
            };
            const source = {
                tags: []
            };

            // When
            const { result } =  Mapper(schema, source);

            // Then
            expect(result).to.equal({
                tags: []
            });
        });

        it('should return empty array when in source matched property is not exist', () => {
            
            // Given
            const schema = {
                tags: [String]
            };
            const source = {};

            // When
            const { result } =  Mapper(schema, source);

            // Then
            expect(result).to.equal({
                tags: []
            });
        });

        it('should collect objects', () => {
            
            // Given
            const schema = {
                tags: [{
                    id: Number,
                    value: String
                }]
            };
            const source = {
                tags: [
                    { id: 1, value: 'a' },
                    { id: 2, value: 'b' }
                ]
            };

            // When
            const { result } = Mapper(schema, source);

            // Then
            expect(result).to.equal({
                tags: [
                    { id: 1, value: 'a' },
                    { id: 2, value: 'b' }
                ]
            });
        });
    });

    it('should collect deep array schema definitions', () => {
        
        // Given
        const schema = {
            tags: [{
                id: Number,
                value: [{
                    name: String
                }]
            }]
        };
        const source = {
            tags: [
                { 
                    id: 1,
                    value: [ { name: 'a' }, { name : 'b'} ]
                }
            ]
        };

        // When
        const { result } = Mapper(schema, source);

        // Then
        expect(result).to.equal({
            tags: [
                { 
                    id: 1,
                    value:  [ { name: 'a' }, { name : 'b'} ]
                }
            ]
        });
    });

    describe('When errors on mapping', () => {
        
        it('should collect unmatched type information', () => {

            // Given
            const schema = {
                id: Number,
                name: String,
                surname: String,
                tags: [Boolean]
            };
            const source = {
                id: '1',
                name: 12,
                surname: false,
                tags: ['a']
            };

            // When
            const { errors } = Mapper(schema, source);

            // Then
            expect(errors).to.equal([
                '<id> property expected to be a Number but it was String',
                '<name> property expected to be a String but it was Number',
                '<surname> property expected to be a String but it was Boolean',
                '<tags[0]> property expected to be a Boolean but it was String'
            ]);
        });

        it('should collect missing property type information', () => {
            
            // Given
            const schema = {
                id: Number,
                name: String,
                surname: String,
                tags: [Boolean]
            };
            const source = {};

            // When
            const { errors } = Mapper(schema, source);

            // Then
            expect(errors).to.equal([
                '<id> property is missing',
                '<name> property is missing',
                '<surname> property is missing',
                '<tags> property is missing'
            ]);
        });
    });
});