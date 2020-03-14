<p align="center">
    <a href="https://www.chialab.io/p/proteins">
        <img alt="Proteins logo" width="144" height="144" src="https://raw.githack.com/chialab/proteins/master/logo.svg" />
    </a>
</p>

<p align="center">
  <strong>Proteins</strong> • A primer for JavaScript libraries and frameworks development.
</p>

<p align="center">
    <a href="https://www.chialab.io/p/proteins"><img alt="Documentation link" src="https://img.shields.io/badge/Docs-chialab.io-lightgrey.svg?style=flat-square"></a>
    <a href="https://github.com/chialab/proteins"><img alt="Source link" src="https://img.shields.io/badge/Source-GitHub-lightgrey.svg?style=flat-square"></a>
    <a href="https://www.chialab.it"><img alt="Authors link" src="https://img.shields.io/badge/Authors-Chialab-lightgrey.svg?style=flat-square"></a>
    <a href="https://www.npmjs.com/package/@chialab/proteins"><img alt="NPM" src="https://img.shields.io/npm/v/@chialab/proteins.svg?style=flat-square"></a>
    <a href="https://github.com/chialab/proteins/blob/master/LICENSE"><img alt="License" src="https://img.shields.io/npm/l/@chialab/proteins.svg?style=flat-square"></a>
</p>

---

## Install

Add as a dependency of a Node project:

```sh
$ npm install @chialab/proteins
# or
$ yarn add @chialab/proteins
```

Use via cdn:
```html
<script type="text/javascript" src="https://unpkg.com/@chialab/proteins"></script>
```

---

## Development

[![Build status](https://github.com/chialab/proteins/workflows/Main/badge.svg)](https://github.com/chialab/proteins/actions?query=workflow%3ABuild)
[![codecov](https://codecov.io/gh/chialab/proteins/branch/master/graph/badge.svg)](https://codecov.io/gh/chialab/proteins)


[![Sauce Test Status](https://saucelabs.com/browser-matrix/chialab-sl-014.svg)](https://app.saucelabs.com/u/chialab-sl-014)



### Requirements

In order to build and test Proteins, the following requirements are needed:
* [NodeJS](https://nodejs.org/) (>= 10.0.0)
* [Yarn](https://yarnpkg.com)
* [RNA](https://github.com/chialab/rna-cli) (>= 3.0.0)

### Build the project

Install the dependencies and run the `build` script:
```
$ yarn install
$ yarn build
```

This will generate the UMD and ESM bundles in the `dist` folder, as well as the declaration file.

### Test the project

Run the `test` script:

```
$ yarn test
```

---

## License

Proteins is released under the [MIT](https://github.com/chialab/proteins/blob/master/LICENSE) license.
