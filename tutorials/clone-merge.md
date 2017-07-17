# Cloning and merging objects with Proteins

## Clone an object

```js
const Person = {
    firstName: 'Alan',
    lastName: 'Turing',
    birthday: new Date('1912/06/12'),
    knowledge: ['math', 'logic', 'cryptography'],
    enemies: [
        { name: 'Enigma', year: '1940' },
        { name: 'Homophobia', year: '1954' },
    ],
};

const Person2 = clone(Person);

console.log(Person === Person2);                          // -> false
console.log(Person.firstName === Person2.firstName);      // -> true
console.log(Person.birthday === Person2.birthday);        // -> false
console.log(Person.knowledge === Person2.knowledge);      // -> false
console.log(Person.knowledge.length === Person2.knowledge.length);    // -> true
console.log(Person.enemies[0] === Person2.enemies[0]);                // -> false
console.log(Person.enemies[0].name === Person2.enemies[0].name);      // -> true
```

## Merge two objects

Starting from two different objects, the are several methods to merge them.

```js
// plain objects
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
```
```js
let newPackage = merge(package, update);

console.log(newPackage.name);                     // -> "proteins"
console.log(newPackage.version);                  // -> "1.1.0"
console.log(newPackage.author);                   // -> "Chialab"
console.log(newPackage.tags.length);              // -> 1
console.log(newPackage.tags[0]);                  // -> "utils"
console.log(newPackage.tags[1]);                  // -> undefined
console.log(newPackage.devDependencies.gulp);     // -> "3.9.0"
console.log(newPackage.devDependencies.karma);    // -> "1.3.0"
console.log(newPackage.devDependencies.mocha);    // -> "3.0.0"
```
```js
let newPackage = merge(package, update, { mergeObjects: false });

console.log(newPackage.name);                     // -> "proteins"
console.log(newPackage.version);                  // -> "1.1.0"
console.log(newPackage.author);                   // -> "Chialab"
console.log(newPackage.tags.length);              // -> 1
console.log(newPackage.tags[0]);                  // -> "utils"
console.log(newPackage.tags[1]);                  // -> undefined
console.log(newPackage.devDependencies.gulp);     // -> "3.9.0"
console.log(newPackage.devDependencies.karma);    // -> undefined
console.log(newPackage.devDependencies.mocha);    // -> "3.0.0"
```
```js
let newPackage = merge(package, update, { joinArrays: true });

console.log(newPackage.name);                     // -> "proteins"
console.log(newPackage.version);                  // -> "1.1.0"
console.log(newPackage.author);                   // -> "Chialab"
console.log(newPackage.tags.length);              // -> 2
console.log(newPackage.tags[0]);                  // -> "javascript"
console.log(newPackage.tags[1]);                  // -> "utils"
console.log(newPackage.devDependencies.gulp);     // -> "3.9.0"
console.log(newPackage.devDependencies.karma);    // -> "1.3.0"
console.log(newPackage.devDependencies.mocha);    // -> undefined
```
```js
let newPackage = merge(package, update, { strictMerge: true });

console.log(newPackage.name);                     // -> "proteins"
console.log(newPackage.version);                  // -> "1.1.0"
console.log(newPackage.author);                   // -> undefined
console.log(newPackage.tags.length);              // -> 1
console.log(newPackage.tags[0]);                  // -> "utils"
console.log(newPackage.tags[1]);                  // -> undefined
console.log(newPackage.devDependencies.gulp);     // -> "3.9.0"
console.log(newPackage.devDependencies.karma);    // -> "1.3.0"
console.log(newPackage.devDependencies.mocha);    // -> "3.0.0"
```
