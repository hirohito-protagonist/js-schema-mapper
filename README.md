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
better to look at [unit test](/test/mapper.js)

-  Basic mapping

```javascript
const Mapper = require('js-schema-mapper');

const person = Mapper.schema({
    id: Number,
    name: String,
    surname: String
});

const data = person.mapFromObject({
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

const data = person.mapFromObject({
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

const data = person.mapFromObject({
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

const data = person.mapFromObject({
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

const data = person.mapFromObject({
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

const data = person.mapFromObject({
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

# API

See the detailed [API Reference](/API.md).

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
Mapping 10 objects to schema x 1,397 ops/sec ±1.09% (181 runs sampled)
Mapping 100 objects to schema x 140 ops/sec ±1.51% (174 runs sampled)
Mapping 1000 objects to schema x 13.36 ops/sec ±2.70% (134 runs sampled)
--------------------------------------------------------------------------------------
Suite name: Mapping 10 objects to schema
The time taken to complete the last cycle (secs) - 0.05512035162280196
The time taken to complete the benchmark (secs)  - 15.461
The time taken to execute the test once (secs)   - 0.0007158487223740515
A timestamp of when the benchmark started (ms)   - 1507572591962
--------------------------------------------------------------------------------------
Suite name: Mapping 100 objects to schema
The time taken to complete the last cycle (secs) - 0.05705801282922823
The time taken to complete the benchmark (secs)  - 15.651
The time taken to execute the test once (secs)   - 0.007132251603653529
A timestamp of when the benchmark started (ms)   - 1507572607479
--------------------------------------------------------------------------------------
Suite name: Mapping 1000 objects to schema
The time taken to complete the last cycle (secs) - 0.07483410380597016
The time taken to complete the benchmark (secs)  - 23.448
The time taken to execute the test once (secs)   - 0.07483410380597016
A timestamp of when the benchmark started (ms)   - 1507572623148
--------------------------------------------------------------------------------------
```

# License
 [MIT](/LICENSE)