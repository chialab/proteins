/* eslint-env mocha */
import {
    Url,
    serialize,
    unserialize,
} from '../src/url.js';

describe('Unit: Url', () => {
    it('should check url validity', () => {
        assert.doesNotThrow(() => new Url('local.host'));
        assert.doesNotThrow(() => new Url('local.host:80'));
        assert.doesNotThrow(() => new Url('//local.host'));
        assert.doesNotThrow(() => new Url('//local.host:80'));
        assert.doesNotThrow(() => new Url('http://localhost/'));
        assert.doesNotThrow(() => new Url('http://localhost:80'));
        assert.doesNotThrow(() => new Url('127.0.0.1'));
        assert.doesNotThrow(() => new Url('127.0.0.1:8080'));
        assert.doesNotThrow(() => new Url('/posts'));
        assert.doesNotThrow(() => new Url('/posts?size=50'));
        assert.doesNotThrow(() => new Url('/posts?size=50&help'));
        assert.doesNotThrow(() => new Url('/posts?size=50/help'));
        assert.doesNotThrow(() => new Url('file:///'));
        assert.doesNotThrow(() => new Url('[::1]'), '[::1]');
        assert.doesNotThrow(() => new Url('[::1]:8080'), '[::1]:8080');
        assert.doesNotThrow(() => new Url('http://[2a00:1450:4002:809::200e]'));
        assert.doesNotThrow(() => new Url('https://user:pass@[::1]:443/path?query#id'));
        assert.throws(() => new Url('http://'), SyntaxError);
        assert.throws(() => new Url(':80'), SyntaxError);
        assert.throws(() => new Url('http:///'), SyntaxError);
        assert.throws(() => new Url('http://:80'), SyntaxError);
        assert.throws(() => new Url('?size=50'), SyntaxError);
        assert.throws(() => new Url('?size=50/help'), SyntaxError);
        // unhandled yet
    });

    it('should get information on a base url', () => {
        let url = new Url('http://www.chialab.it:80/posts?size=10');

        assert.equal(url.href, 'http://www.chialab.it:80/posts?size=10');
        assert.equal(url.protocol, 'http:');
        assert.equal(url.hostname, 'www.chialab.it');
        assert.equal(url.port, '80');
        assert.equal(url.host, 'www.chialab.it:80');
        assert.equal(url.search, '?size=10');
        assert.equal(url.origin, 'http://www.chialab.it:80');

        assert(new Url('http://www.chialab.it:80').isAbsoluteUrl());
        assert(new Url('mailto:test@test.com').isAbsoluteUrl());
        assert(new Url('tel:5555').isAbsoluteUrl());
        assert(!new Url('http://www.chialab.it:80').isDataUrl());
        assert(!new Url('http://www.chialab.it:80').isLocalUrl());
        assert(!new Url('/posts').isAbsoluteUrl());
        assert(!new Url('/posts').isDataUrl());
        assert(!new Url('/posts').isLocalUrl());
        assert(new Url('file:///').isAbsoluteUrl());
        assert(!new Url('file:///').isDataUrl());
        assert(new Url('file:///').isLocalUrl());
    });

    it('should exec operations on search path', () => {
        let url = new Url('http://www.chialab.it:80/posts?size=10');
        let searchParams = url.searchParams;

        assert.equal(searchParams.entries().length, 1);
        assert.equal(searchParams.get('size'), '10');

        searchParams.delete('size');
        assert.equal(searchParams.entries().length, 0);
        assert.equal(searchParams.get('size'), undefined);

        searchParams.set('size', 2);
        searchParams.set('size', 11);

        assert.equal(searchParams.entries().length, 1);
        assert.equal(searchParams.get('size'), '11');

        searchParams.set('order', 1);
        searchParams.set('page', 2);

        assert.equal(searchParams.entries().length, 3);
        assert.deepEqual(searchParams.keys(), ['size', 'order', 'page']);
        assert.deepEqual(searchParams.values(), ['11', '1', '2']);

        searchParams.sort();
        assert.equal(searchParams.entries().length, 3);
        assert.deepEqual(searchParams.keys(), ['order', 'page', 'size']);
        assert.deepEqual(searchParams.values(), ['1', '2', '11']);

        assert(searchParams.has('size'));
        assert(searchParams.has('page'));
        assert(!searchParams.has('name'));

        assert(searchParams.toString(), '?order=1&page=2&size=11');
        assert(url.toString(), 'http://www.chialab.it:80/posts?order=1&page=2&size=11');
    });

    it('should resolve locations', () => {
        let url = new Url('/posts', 'chialab.it');

        assert.equal(url.href, 'chialab.it/posts');

        let url2 = url.join('2', 'info');
        assert.equal(url2.href, 'chialab.it/posts/2/info');

        let url3 = url2.resolve('../3/info');
        assert.equal(url3.href, 'chialab.it/posts/3/info');

        let url4 = url3.resolve('./edit');
        assert.equal(url4.href, 'chialab.it/posts/3/edit');

        assert.throws(() => new Url('/posts').resolve('/article'), Error);
    });

    it('should serialize objects', () => {
        let person = {
            firstName: 'Alan',
            age: 21,
            birthday: new Date('1912-06-11T22:00:00.000Z'),
            filter: {
                tags: ['math'],
                jobs: {},
            },
        };
        let serialized = serialize(person);
        let unserialized = unserialize(serialized);

        assert.equal(serialized, `firstName=Alan&age=21&birthday=${encodeURIComponent('1912-06-11T22:00:00.000Z')}&${encodeURIComponent('filter[tags][0]')}=math&${encodeURIComponent('filter[jobs]')}`);
        assert.equal(person.firstName, unserialized.firstName);
        assert.equal(person.age, unserialized.age);
        assert.equal(person.birthday.getTime(), new Date(unserialized.birthday).getTime());
    });

    it('should unserialize complex string', () => {
        let serialized = 'filter[name]=Alan&filter[geo][latitude]=41&filter[type]=person&size=1&filter[tags][]=math';
        let unserialized = unserialize(serialized);
        assert.deepEqual(unserialized, {
            filter: {
                name: 'Alan',
                geo: {
                    latitude: '41',
                },
                type: 'person',
                tags: ['math'],
            },
            size: '1',
        });
    });
});
