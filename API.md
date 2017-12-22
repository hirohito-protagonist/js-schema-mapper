# API Reference

## Mapper

### `schema(schemaDefinition: Object)`

returns

`{ mapFromCollection: Function, mapFromObject: Function, map: Function }`

Supported schema types: `Object`, `Number`, `String`, `Array`, `Boolean`

Example:
```javascript
const Mapper = require('js-schema-mapper');

const person = Mapper.schema({
    id: Number,
    name: String,
    surname: String
});
```

## Schema

### `mapFromCollection(source: Array)`

returns

`{ result: Array, errors: Array }`

Examples:
```javascript
const Mapper = require('js-schema-mapper');

const person = Mapper.schema({
    id: Number,
    name: String,
    surname: String
});

const data = person.mapFromCollection([{
    id: 1,
    name: 'Hiro',
    surname: 'Hito'
}]);
```

```javascript
// Output
{
    result: [
        {
            id: 1,
            name: 'Hiro',
            surname: 'Hito'
        }
    ],
    errors: []
}
```

### `mapFromObject(source: Object)`

returns

`{ result: Object, errors: Array }`

Examples:
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
```

```javascript
// Output
{
    result: {
        id: 1,
        name: 'Hiro',
        surname: 'Hito'
    },
    errors: []
}
```

### `map(source: Object|Array)`

returns

`{ result: Array, errors: Array }`

Examples:
```javascript
const Mapper = require('js-schema-mapper');

const person = Mapper.schema({
    id: Number,
    name: String,
    surname: String
});

const data = person.map([{
    id: 1,
    name: 'Hiro',
    surname: 'Hito'
}]);
```

```javascript
// Output
{
    result: [
        {
            id: 1,
            name: 'Hiro',
            surname: 'Hito'
        }
    ],
    errors: []
}
```


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
```

```javascript
// Output
{
    result: [
        {
            id: 1,
            name: 'Hiro',
            surname: 'Hito'
        }
    ],
    errors: []
}
```

There is one issue with `map` when source is empty object or empty array. The result output
is inconsistent. Here is example:

Empty object as source:
```javascript
const data = person.map({});
```

```javascript
// Output
{
    result: [
        {
            id: 0,
            name: '',
            surname: ''
        }
    ],
    errors: []
}
```

Empty array as source:
```javascript
const data = person.map([]);
```

```javascript
// Output
{
    result: [],
    errors: []
}
```

To prevent this you need to define which property is required in your object to be valid and
then you can filter result. In this case we take `id` as our required property then we can filter
result for both cases to have consistent output.

```javascript
const data = person.map({});
const result = data.result.filter(o => o.id !== 0);
```

```javascript
// Output result
[]
```

```javascript
const data = person.map([]);
const result = data.result.filter(o => o.id !== 0);
```

```javascript
// Output result
[]
```
