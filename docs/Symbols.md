## Set a symbolic property

```js
import { Symbolic } from '@chialab/proteins';

const OWNER_SYMBOL = Symbolic('owner');
const scope = {};

scope[OWNER_SYMBOL] = 11;
console.log(scope.owner); // undefined
console.log(scope[OWNER_SYMBOL])); // 11
console.log(Object.keys(scope)); // []
```

## Check if symbolic property is defined

```js
import { Symbolic } from '@chialab/proteins';

const OWNER_SYMBOL = Symbolic('owner');
const scope = {};

console.log(OWNER_SYMBOL.has(scope)); // false
scope[OWNER_SYMBOL] = 11;
console.log(OWNER_SYMBOL.has(scope)); // true
delete scope[OWNER_SYMBOL];
```
