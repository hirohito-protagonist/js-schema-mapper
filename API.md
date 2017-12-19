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

`{ result: Object, errors: Array }`
