# Symbols and internals

## Set a symbolic property

```js
import { symbolic } from '@chialab/proteins';

const OWNER_SYMBOL = symbolic('owner');
const scope = {};

OWNER_SYMBOL(scope, 11);
console.log(scope.owner); // undefined
console.log(OWNER_SYMBOL(scope)); // 11
```

## Check if symbolic property is defined

```js
import { symbolic } from '@chialab/proteins';

const OWNER_SYMBOL = symbolic('owner');
const scope = {};

console.log(OWNER_SYMBOL.has(scope)); // false
OWNER_SYMBOL(scope, 11);
console.log(OWNER_SYMBOL.has(scope)); // true
```

## Set private properties

```js
import { internal } from '@chialab/proteins';

const scope = {};

internal(scope).myPrivateProp = 11;
console.log(scope.myPrivateProp); // undefined
console.log(internal(scope).myPrivateProp); // 11
```

## Check if internal scope is defined

```js
import { internal } from '@chialab/proteins';

const scope = {};

console.log(internal.has(scope)); // false
internal(scope).myPrivateProp = 11;
console.log(internal.has(scope)); // true
```

## Destroy private properties

```js
import { internal } from '@chialab/proteins';

const scope = {};

internal(scope).myPrivateProp = 11;
console.log(internal.has(scope)); // true
internal.destroy(scope);
console.log(internal.has(scope)); // false
```
