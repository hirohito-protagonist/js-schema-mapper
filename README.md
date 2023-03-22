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
Chip: Apple M1
Memory: 16 GB
```

The command to run benchmark:
```bash
npm run perf
```

Example benchmark output:
```bash
Mapping 10 objects to schema x 16,895 ops/sec ±0.16% (195 runs sampled)
Mapping 100 objects to schema x 1,695 ops/sec ±0.19% (192 runs sampled)
Mapping 1000 objects to schema x 170 ops/sec ±0.20% (182 runs sampled)
--------------------------------------------------------------------------------------
Suite name: Mapping 10 objects to schema
The time taken to complete the last cycle (secs) - 0.05137682888515251
The time taken to complete the benchmark (secs)  - 11.924
The time taken to execute the test once (secs)   - 0.00005918989502897755
A timestamp of when the benchmark started (ms)   - 1679507153715
--------------------------------------------------------------------------------------
Suite name: Mapping 100 objects to schema
The time taken to complete the last cycle (secs) - 0.0525151535985344
The time taken to complete the benchmark (secs)  - 11.722
The time taken to execute the test once (secs)   - 0.0005900579056015101
A timestamp of when the benchmark started (ms)   - 1679507165648
--------------------------------------------------------------------------------------
Suite name: Mapping 1000 objects to schema
The time taken to complete the last cycle (secs) - 0.052866817758241744
The time taken to complete the benchmark (secs)  - 12.18
The time taken to execute the test once (secs)   - 0.005874090862026861
A timestamp of when the benchmark started (ms)   - 1679507177376
--------------------------------------------------------------------------------------
```

# License
 [MIT](/LICENSE)