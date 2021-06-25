<p align="center">
    <a href="https://www.chialab.io/p/proteins">
        <img alt="Proteins logo" width="144" height="144" src="https://raw.githack.com/chialab/proteins/master/logo.svg" />
    </a>
</p>

<p align="center">
  <strong>Proteins</strong> • A primer for JavaScript libraries and frameworks development.
</p>

<p align="center">
    <a href="https://www.npmjs.com/package/@chialab/proteins"><img alt="NPM" src="https://img.shields.io/npm/v/@chialab/proteins.svg"></a>
</p>

---

## Install

Add as a dependency of a Node project:

```sh
$ npm install @chialab/proteins
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

### Build the project

Install the dependencies and run the `build` script:
```
$ npm run install
$ npm run build
```

This will generate the UMD and ESM bundles in the `dist` folder, as well as the declaration file.

### Test the project

Run the `test` script:

```
$ npm run test
```

### Release

The `release` script uses [Semantic Release](https://github.com/semantic-release/semantic-release) to update package version, create a Github release and publish to the NPM registry.

An environment variable named `GH_TOKEN` with a [generated Github Access Token](https://github.com/settings/tokens/new?scopes=repo) needs to be defined in a local `.env` file.

```shell
$ echo 'export GH_TOKEN="abcxyz"' > .env
```

Now you are ready to run the `release` command:

```sh
$ npm run release
```

---

## License

Proteins is released under the [MIT](https://github.com/chialab/proteins/blob/master/LICENSE) license.
