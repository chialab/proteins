# Getting started

## Overview

**Proteins is something little to produce big results.**

It is a set of tools for libraries and frameworks developers, a _primer_ for just starting to code some beauty without to waste time in "rewrite" the wheel.

It also cares about your (and your users') bandwidth: no dependencies and less than 5kb bundled and gzipped.

Proteins is written using pure ES6 JavaScript, without DOM assumptions, so it works (🤞) everywhere: Node environments, evergreen browsers, NativeScript, Electron.

## Install

Proteins is published to the NPM registry.

::: code-group

```bash [npm]
npm install @chialab/proteins
```

```bash [yarn]
yarn add @chialab/proteins
```

```bash [pnpm]
pnpm add @chialab/proteins
```

:::

## Usage

```ts
// Import what you need
import { clone, merge, Symbolic } from '@chialab/proteins';
```
