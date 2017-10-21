# API Reference

## Mapper

### `schema(schemaDefinition: Object)`

returns

`{ mapFromCollection: Function, mapFromObject: Function, map: Function }`

## Schema

### `mapFromCollection(source: Array)`

returns

`{ result: Array, errors: Array }`

### `mapFromObject(source: Object)`

returns

`{ result: Object, errors: Array }`

### `map(source: Object|Array)`

returns

`{ result: Object, errors: Array }`
