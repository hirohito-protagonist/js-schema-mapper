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

# License
 [MIT](/LICENSE)