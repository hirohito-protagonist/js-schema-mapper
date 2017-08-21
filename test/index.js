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
});