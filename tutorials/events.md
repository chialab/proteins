# Events

## Trigger events

```js
import { on, trigger } from '@chialab/proteins';

const scope = {};
on(scope, 'change', (timestamp) => {
    console.log(timestamp);
});

trigger(scope, 'change', Date.now());
```

## Remove a specific listener

```js
import { on, off, trigger } from '@chialab/proteins';

const scope = {};

const callback = (timestamp) => {
    // it fires only once
    console.log(timestamp);
};

on(scope, 'change', callback);
trigger(scope, 'change', Date.now());
off(scope, 'change', callback);
trigger(scope, 'change', Date.now());
```

## Remove multiple (or all) listeners

```js
import { on, off, trigger } from '@chialab/proteins';

const scope = {};

const callback = (timestamp) => {
    // it fires only once
    console.log(timestamp);
};

on(scope, 'change', callback);
trigger(scope, 'change', Date.now());
off(scope);
trigger(scope, 'change', Date.now());
```
