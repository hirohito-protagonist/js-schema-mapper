# js-schema-mapper

This project is a data facade between your application and internal or external data provider. The mapper is dedicated to be use in backend Node JS applications.

# Motivation

- Eliminate branching code with detection if properties from json was delivered.
  For example instead of write something like this `prop && prop.name ? prop.name : '' ` it is better to write
  just `prop.name` and to be sure what default value will be if the property will be missing.
- Faster detection if the bug in application is cause by data inconsistency. Something like we expect
  boolean but there was delivered string or object but we have primitive value.

# Examples

Examples are just overview to show core functionality for complete specification it is 
better to look at [unit test](/test/index.js)

-  Basic mapping

```javascript
const Mapper = require('js-schema-mapper');

const person = Mapper.schema({
    id: Number,
    name: String,
    surname: String
});

const data = person.map({
    id: 1,
    name: 'Hiro',
    surname: 'Hito'
});

console.log(data);

// output
// {
//    id: 1,
//    name: 'Hiro',
//    surname: 'Hito'
// }
```

- Mapping to default values when data have different type

```javascript
const Mapper = require('js-schema-mapper');

const person = Mapper.schema({
    id: Number,
    name: String,
    surname: String
});

const data = person.map({
    id: '1',
    name: 123,
    surname: 123
});

console.log(data.result);

// output
// {
//    id: 0,
//    name: '',
//    surname: ''
// }
```


- Mapping to default values when data have missing properties

```javascript
const Mapper = require('js-schema-mapper');

const person = Mapper.schema({
    id: Number,
    name: String,
    surname: String
});

const data = person.map({
    id: 1,
    name: 'Hiro'
});

console.log(data.result);

// output
// {
//    id: 1,
//    name: 'Hiro',
//    surname: ''
// }
```


- Mapping nested schema definitions

```javascript
const Mapper = require('js-schema-mapper');

const person = Mapper.schema({
    id: Number,
    name: String,
    address: {
        street: String
    }
});

const data = person.map({
    id: 1,
    name: 'Hiro',
    address: {
        street: 'Metaverse'
    }
});

console.log(data.result);

// output
// {
//    id: 1,
//    name: 'Hiro',
//    address: {
//        street: 'Metaverse'
//    }
// }
```

- Mapping collection of primitives values

```javascript
const Mapper = require('js-schema-mapper');

const person = Mapper.schema({
    id: Number,
    name: String,
    tags: [String]
});

const data = person.map({
    id: 1,
    name: 'Hiro',
    tags: ['a', 'b']
});

console.log(data.result);

// output
// {
//    id: 1,
//    name: 'Hiro',
//    tags: ['a', 'b']
// }
```

- Mapping collection of objects

```javascript
const Mapper = require('js-schema-mapper');

const person = Mapper.schema({
    id: Number,
    name: String,
    tags: [{
        id: Number,
        value: String
    }]
});

const data = person.map({
    id: 1,
    name: 'Hiro',
    tags: [
        {
            id: 1,
            value: 'a'
        },
        {
            id: '2',
            value: 1
        }
    ]
});

console.log(data.result);

// output
// {
//    id: 1,
//    name: 'Hiro',
//    tags: [
//        {
//            id: 1,
//            value: 'a'
//        },
//        {
//            id: 0,
//            value: ''
//        }
//    ]
// }
```
# Benchmark

This benchmark is just overview how fast is the schema mapper and the speed depends on 
machine where the benchmark will be run.


The spec machine on which the benchmark was run:
```
AMD A10-4665M APU with Radeon(tm) HD Graphics 2.00 GHz
10.0 GB RAM DDR3
Hitachi HDD
```

The command to run benchmark:
```bash
npm run perf
```

Example benchmark output:
```bash
Mapping 10 objects to schema x 1,457 ops/sec ±3.31% (165 runs sampled)
Mapping 100 objects to schema x 158 ops/sec ±2.23% (168 runs sampled)
Mapping 1000 objects to schema x 16.67 ops/sec ±2.95% (145 runs sampled)
--------------------------------------------------------------------------------------
Suite name: Mapping 10 objects to schema
The time taken to complete the last cycle (secs) - 0.06793935241207442
The time taken to complete the benchmark (secs)  - 15.137
The time taken to execute the test once (secs)   - 0.0006862560849704488
A timestamp of when the benchmark started (ms)   - 1505763021356
--------------------------------------------------------------------------------------
Suite name: Mapping 100 objects to schema
The time taken to complete the last cycle (secs) - 0.06331102804960319
The time taken to complete the benchmark (secs)  - 15.411
The time taken to execute the test once (secs)   - 0.006331102804960319
A timestamp of when the benchmark started (ms)   - 1505763036600
--------------------------------------------------------------------------------------
Suite name: Mapping 1000 objects to schema
The time taken to complete the last cycle (secs) - 0.05997882990344831
The time taken to complete the benchmark (secs)  - 20.482
The time taken to execute the test once (secs)   - 0.05997882990344831
A timestamp of when the benchmark started (ms)   - 1505763052032
--------------------------------------------------------------------------------------
```

# License
 [MIT](/LICENSE)