Create a deep-observed dataset of objects using the `Observable` class, proxing objects (or arrays) in order to emit the `change` event every time a property has been updated.
```js
import { Observable } from '@chialab/proteins';

let article = new Observable({
    title: 'My Title',
    tags: ['math', 'history', 'physics'],
    created: new Date(),
});

article.on('change', (changeset) => console.log(changeset));

article.title = 'Custom title';
article.tags[0] = 'psychology';
article.tags.push('comics');
```

```js
// Output:
{ property: 'title', newValue: 'Custom title', oldValue: 'My Title' }
{ property: 'tags.0', newValue: 'psychology', oldValue: 'math' }
{ property: 'tags.3', added: ['comics'], removed: [] }
```

## Limitations
Due to the limited ES6 Proxy support, some features have cross-browsing issues:
* New object properties added after the `Observable` creation are not watched.
* Adding values to an array using assignation (`arr[arr.length] = 2;`) is not supported too. Use `Array.prototype` methods instead to update arrays in order to watch new properties.