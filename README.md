[![License](https://img.shields.io/badge/license-MIT-green.svg)](/LICENSE)
[![Node](https://img.shields.io/badge/node-%3E=8.0.0-green.svg)](https://nodejs.org/en/)
![Test Coverage](https://img.shields.io/badge/coverage-100%25-brightgreen.svg)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)



# js-schema-mapper

This project is a data facade between your application and internal or external data provider. The mapper is dedicated to be use in backend Node JS applications.

# Motivation

- Eliminate branching code with detection if properties from json was delivered.
  For example instead of write something like this `prop && prop.name ? prop.name : '' ` it is better to write
  just `prop.name` and to be sure what default value will be if the property will be missing.
- Faster detection if the bug in application is cause by data inconsistency. Something like we expect
  boolean but there was delivered string or object but we have primitive value.


# API

See the detailed [API Reference](/API.md).

# Example

It covers just one function from exposed [API](/API.md).
To see more examples look at [unit tests](/test/mapper.js)

```javascript
const Mapper = require('js-schema-mapper');

const person = Mapper.schema({
    id: Number,
    name: String,
    surname: String,
    tags: [Boolean]
});

const result = person.map({
    id: '1',
    name: 'Hiro',
    surname: false,
    tags: ['a']
});
```

```javascript
// result output
{
    result: [
        {
            id: 0,
            name: 'Hiro',
            surname: '',
            tags: [false]
        }
    ],
    errors: [
        '<id> property expected to be a Number but it was String',
        '<surname> property expected to be a String but it was Boolean',
        '<tags[0]> property expected to be a Boolean but it was String'
    ]
}
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
Mapping 10 objects to schema x 2,547 ops/sec ±1.29% (175 runs sampled)
Mapping 100 objects to schema x 261 ops/sec ±1.65% (163 runs sampled)
Mapping 1000 objects to schema x 25.44 ops/sec ±1.31% (138 runs sampled)
--------------------------------------------------------------------------------------
Suite name: Mapping 10 objects to schema
The time taken to complete the last cycle (secs) - 0.058886015200724964
The time taken to complete the benchmark (secs)  - 13.677
The time taken to execute the test once (secs)   - 0.00039257343467149976
A timestamp of when the benchmark started (ms)   - 1534356127039
--------------------------------------------------------------------------------------
Suite name: Mapping 100 objects to schema
The time taken to complete the last cycle (secs) - 0.06505252866474952
The time taken to complete the benchmark (secs)  - 13.905
The time taken to execute the test once (secs)   - 0.00382661933322056
A timestamp of when the benchmark started (ms)   - 1534356140730
--------------------------------------------------------------------------------------
Suite name: Mapping 1000 objects to schema
The time taken to complete the last cycle (secs) - 0.07862755826086962
The time taken to complete the benchmark (secs)  - 18.682
The time taken to execute the test once (secs)   - 0.03931377913043481
A timestamp of when the benchmark started (ms)   - 1534356154645
--------------------------------------------------------------------------------------
```

# License
 [MIT](/LICENSE)