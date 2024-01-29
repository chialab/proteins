# Type utilities

Sometimes, JavaScript is very odd, especially when you need to recognise the input parameter type of a function. In order to keep the code clear and more safe, Proteins exports a set of type checking function:

## Functions

```js
import { isFunction } from '@chialab/proteins';

isFunction(() => {}); // -> true
isFunction(Object.toString); // -> true
isFunction(class {}); // -> true
```

## Arrays

```js
import { isArray } from '@chialab/proteins';

isArray([1, 2, 3]); // -> true
isArray(document.body.children); // -> false
```

## Strings

```js
import { isString } from '@chialab/proteins';

isString('hello'); // -> true
isString('2'); // -> true
```

## Numbers

```js
import { isNumber } from '@chialab/proteins';

// some js oddities
isNaN('2'); // -> false
typeof NaN === 'number'; // -> true

isNumber(2); // -> true
isNumber('2'); // -> false
isNumber(NaN); // -> false
```

## Booleans

```js
import { isBoolean } from '@chialab/proteins';

isBoolean(false); // -> true
isBoolean(true); // -> true
```

## Dates

```js
import { isDate } from '@chialab/proteins';

isDate(new Date()); // -> true
isDate('2017/05/12'); // -> false
```

## Objects

```js
import { isObject } from '@chialab/proteins';

// some js oddities
typeof null === 'object'; // -> true

isObject({}); // -> true
isObject(new Date()); // -> false
```

## Undefined values

```js
import { isUndefined } from '@chialab/proteins';

isUndefined(undefined); // -> true
isUndefined(null); // -> false
```

## Falsy values

```js
import { isFalsy } from '@chialab/proteins';

isFalsy(null); // -> true
isFalsy(undefined); // -> true
isFalsy(false); // -> true
isFalsy(0); // -> false
isFalsy(''); // -> false
```
