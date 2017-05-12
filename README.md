# Proteins

A set of JavaScript utils.

[![Travis](https://img.shields.io/travis/Chialab/proteins.svg?maxAge=2592000)](https://travis-ci.org/Chialab/proteins)
[![Code coverage](https://codecov.io/gh/Chialab/proteins/graph/badge.svg)](https://codecov.io/gh/Chialab/proteins)
[![NPM](https://img.shields.io/npm/v/@chialab/proteins.svg)](https://www.npmjs.com/package/@chialab/proteins)

[![Sauce Test Status](https://saucelabs.com/browser-matrix/chialab-sl-014.svg)](https://saucelabs.com/u/chialab-sl-014)

---

## Types

Combine `typeof` and `instanceof` for objects type/value checkings.

```js
import {
    isString,
    isNumber,
    isObject,
    isFunction,
    isUndefined,
    isBoolean,
    isDate,
    isArray,
    isFalsy,
} from '@chialab/proteins';

// Check if an object is a string.
isString('hello')           // -> true
// Check if an object is a number.
isNumber(2)                 // -> true
isNumber('2')               // -> false
isNumber(NaN)               // -> false
// Check if an object is an Object.
isObject({})                // -> true
isObject(new Date())        // -> false
// Check if an object is a Function.
isFunction(() => {})        // -> true
isFunction(Object.toString) // -> true
isFunction(class {})        // -> true
// Check if an object is undefined.
isUndefined(undefined)      // -> true
isUndefined(null)           // -> false
// Check if an object is a Boolean.
isBoolean(false)            // -> true
// Check if an object is a Date.
isDate(new Date())          // -> true
isDate('2017/05/12')        // -> false
// Check if an object is an Array
isArray([1, 2, 3])              // -> true
isArray(document.body.children) // -> false
// Check if an object is undefined OR null OR false OR NaN
isFalsy(null)               // -> true
isFalsy('')                 // -> false
```

## Clone and Merge

Utils for objects deep clone and deep merge.

```js
import { clone } from '@chialab/proteins';

let Person = {
    firstName: 'Alan',
    lastName: 'Turing',
    birthday: new Date('1912/06/12'),
    knowledge: ['math', 'logic', 'cryptography'],
    enemies: [
        { name: 'Enigma', year: '1940' },
        { name: 'Homophobia', year: '1954' },
    ],
};

let Person2 = clone(Person);

Person === Person2                          // -> false
Person.firstName === Person2.firstName      // -> true
Person.birthday === Person2.birthday        // -> false
Person.knowledge === Person2.knowledge      // -> false
Person.knowledge.length === Person2.knowledge.length    // -> true
Person.enemies[0] === Person2.enemies[0]                // -> false
Person.enemies[0].name === Person2.enemies[0].name      // -> true
```

`merge(options?)` accepts three options:
- **mergeObjects**: update an object instead of replace it. (Default: `true`)
- **joinArrays**: update an array instead of replace it. (Default: `false`)
- **strictMerge**: update only property of the first object (ignore additional properties). (Default: `false`)

```js
import { merge } from '@chialab/proteins';

let package = {
    name: 'proteins',
    version: '1.0.0',
    tags: ['javascript'],
    devDependencies: {
        gulp: '3.5.0',
        karma: '1.3.0',
    },
};

let update = {
    version: '1.1.0',
    author: "Chialab",
    tags: ['utils'],
    devDependencies: {
        gulp: '3.9.0',
        mocha: '3.0.0',
    },
};

let newPackage;

// Default options
newPackage = merge(package, update);
newPackage.name                     // -> "proteins"
newPackage.version                  // -> "1.1.0"
newPackage.author                   // -> "Chialab"
newPackage.tags.length              // -> 1
newPackage.tags[0]                  // -> "utils"
newPackage.tags[1]                  // -> undefined
newPackage.devDependencies.gulp     // -> "3.9.0"
newPackage.devDependencies.karma    // -> "1.3.0"
newPackage.devDependencies.mocha    // -> "3.0.0"

// without `mergeObjects` option
newPackage = merge(package, update, { mergeObjects: false });
newPackage.name                     // -> "proteins"
newPackage.version                  // -> "1.1.0"
newPackage.author                   // -> "Chialab"
newPackage.tags.length              // -> 1
newPackage.tags[0]                  // -> "utils"
newPackage.tags[1]                  // -> undefined
newPackage.devDependencies.gulp     // -> "3.9.0"
newPackage.devDependencies.karma    // -> undefined
newPackage.devDependencies.mocha    // -> "3.0.0"

// with `joinArrays` option
newPackage = merge(package, update, { joinArrays: true });
newPackage.name                     // -> "proteins"
newPackage.version                  // -> "1.1.0"
newPackage.author                   // -> "Chialab"
newPackage.tags.length              // -> 2
newPackage.tags[0]                  // -> "javascript"
newPackage.tags[1]                  // -> "utils"
newPackage.devDependencies.gulp     // -> "3.9.0"
newPackage.devDependencies.karma    // -> "1.3.0"
newPackage.devDependencies.mocha    // -> undefined

// with `strictMerge` option
newPackage = merge(package, update, { strictMerge: true });
newPackage.name                     // -> "proteins"
newPackage.version                  // -> "1.1.0"
newPackage.author                   // -> undefined
newPackage.tags.length              // -> 1
newPackage.tags[0]                  // -> "utils"
newPackage.tags[1]                  // -> undefined
newPackage.devDependencies.gulp     // -> "3.9.0"
newPackage.devDependencies.karma    // -> "1.3.0"
newPackage.devDependencies.mocha    // -> "3.0.0"
```
