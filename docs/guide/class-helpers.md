# Class helpers

## Create a mixin

```js
import { mix } from '@chialab/proteins';

class MySuperClass {
    constructor() {
        // do something
    }
}

const Mixin = (SuperClass) => class extends SuperClass {
    constructor() {
        super();
        // do something else
    }
};

class MixedClass extends mix(MySuperClass).with(Mixin) {
    ...
}
```
