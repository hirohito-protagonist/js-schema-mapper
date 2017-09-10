# js-schema-mapper


# Examples

## Basic mapping

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

## Basic mapping

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

console.log(data.result);

// output
// {
//    id: 1,
//    name: 'Hiro',
//    surname: 'Hito'
// }
```

## Mapping to default values when data have different type

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


## Mapping to default values when data have missing properties

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


## Mapping nested schema definitions

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

## Mapping collection of primitives values

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

## Mapping collection of objects

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
Mapping 10 objects to schema x 1,452 ops/sec ±1.16% (178 runs sampled)
Mapping 100 objects to schema x 145 ops/sec ±1.25% (177 runs sampled)
Mapping 1000 objects to schema x 14.47 ops/sec ±1.12% (135 runs sampled)
--------------------------------------------------------------------------------------
Suite name: Mapping 10 objects to schema
The time taken to complete the last cycle (secs) - 0.055801548022104436
The time taken to complete the benchmark (secs)  - 15.225
The time taken to execute the test once (secs)   - 0.0006889080002728942
A timestamp of when the benchmark started (ms)   - 1504897458435
--------------------------------------------------------------------------------------
Suite name: Mapping 100 objects to schema
The time taken to complete the last cycle (secs) - 0.055360643887005644
The time taken to complete the benchmark (secs)  - 15.386
The time taken to execute the test once (secs)   - 0.0069200804858757054
A timestamp of when the benchmark started (ms)   - 1504897473719
--------------------------------------------------------------------------------------
Suite name: Mapping 1000 objects to schema
The time taken to complete the last cycle (secs) - 0.06910863497037043
The time taken to complete the benchmark (secs)  - 21.891
The time taken to execute the test once (secs)   - 0.06910863497037043
A timestamp of when the benchmark started (ms)   - 1504897489137
--------------------------------------------------------------------------------------
```

# License
 [MIT](/LICENSE)