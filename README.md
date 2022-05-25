<p align="center">
    <a href="https://www.chialab.io/p/proteins">
        <img alt="Proteins logo" width="144" height="144" src="https://raw.githack.com/chialab/proteins/main/logo.svg" />
    </a>
</p>

<p align="center">
  <strong>Proteins</strong> • A primer for JavaScript libraries and frameworks development.
</p>

<p align="center">
    <a href="https://www.npmjs.com/package/@chialab/proteins"><img alt="NPM" src="https://img.shields.io/npm/v/@chialab/proteins.svg"></a>
</p>

---

## Get the library

Usage via [unpkg.com](https://unpkg.com/) as ES6 module:

```js
import { isArray, isObject, merge, mix, ... } from 'https://unpkg.com/@chialab/proteins?module';
```

Install via NPM:

```sh
$ npm i @chialab/proteins
$ yarn add @chialab/proteins
```

```ts
import { isArray, isObject, merge, mix, ... } from '@chialab/proteins';
```

---

## Development

[![Build status](https://github.com/chialab/proteins/workflows/Main/badge.svg)](https://github.com/chialab/proteins/actions?query=workflow%3ABuild)
[![codecov](https://codecov.io/gh/chialab/proteins/branch/main/graph/badge.svg)](https://codecov.io/gh/chialab/proteins)


[![Sauce Test Status](https://saucelabs.com/browser-matrix/chialab-sl-014.svg)](https://app.saucelabs.com/u/chialab-sl-014)

### Build the project

Install the dependencies and run the `build` script:
```
$ yarn install
$ yarn build
```

This will generate the cjs and esm bundles in the `dist` folder, as well as the declaration file.

### Test the project

Run the `test` script for both Node and browser environments:

```
$ yarn test
```

---

## License

Proteins is released under the [MIT](https://github.com/chialab/proteins/blob/main/LICENSE) license.
