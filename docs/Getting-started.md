Proteins sources and bundle is available on [NPM](https://www.npmjs.com/package/@chialab/proteins) and [Github releases page](https://github.com/Chialab/proteins/releases).

## Install via NPM

In your project, run:

```sh
npm install @chialab/proteins
```

## Usage

Once Proteins has been installed, you can require it using a script tag
```html
<script type="text/javascript" src="node_modules/@chialab/proteins/dist/proteins.js"></script>
```
or ES6 import (it is fully compatibile with Webpack, Rollup, SystemJS and other bundlers)
```js
// Import the full module
import * as Proteins from '@chialab/proteins';

// Import what you need
import { Symbolic, clone, merge } from '@chialab/proteins';

// Import single file (improves tree shaking)
import Symbolic from '@chialab/proteins/src/symbolic.js';
```
