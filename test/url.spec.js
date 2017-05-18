/* eslint-env mocha */
import { Url, serialize, unserialize } from '../src/url.js';

describe('Unit: Url', () => {
    it('should check url validity', () => {
        assert.doesNotThrow(() => new Url('local.host'), 'local.host');
        assert.doesNotThrow(() => new Url('local.host:80'), 'local.host:80');
        assert.doesNotThrow(() => new Url('//local.host'), '//local.host');
        assert.doesNotThrow(() => new Url('//local.host:80'), '//local.host:80');
        assert.doesNotThrow(() => new Url('http://localhost'), 'http://localhost');
        assert.doesNotThrow(() => new Url('http://localhost:80'), 'http://localhost:80');
        assert.doesNotThrow(() => new Url('/posts'), '/posts');
        assert.doesNotThrow(() => new Url('/posts?size=50'), '/posts?size=50');
        assert.doesNotThrow(() => new Url('/posts?size=50&help'), '/posts?size=50&help');
        assert.doesNotThrow(() => new Url('/posts?size=50/help'), '/posts?size=50/help');
        assert.doesNotThrow(() => new Url('file:///'), 'file:///');
        assert.doesNotThrow(() => new Url('file:///'), 'file:///');
        assert.throws(() => new Url('http://'), SyntaxError, 'http://');
        assert.throws(() => new Url(':80'), SyntaxError, ':80');
        assert.throws(() => new Url('http:///'), SyntaxError, 'http:///');
        assert.throws(() => new Url('http://:80'), SyntaxError, 'http://:80');
        assert.throws(() => new Url('?size=50'), SyntaxError, '?size=50');
        assert.throws(() => new Url('?size=50/help'), SyntaxError, '?size=50/help');
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
    });

    it('should serialize simple string', () => {
        let person = {
            firstName: 'Alan',
            age: 21,
            birthday: new Date('1912/06/12'),
        };
        let serialized = serialize(person);
        let unserialized = unserialize(serialized);

        assert.equal(serialized, `firstName=Alan&age=21&birthday=${encodeURIComponent('1912-06-11T22:00:00.000Z')}`);
        assert.equal(person.firstName, unserialized.firstName);
        assert.equal(person.age, unserialized.age);
        assert.equal(person.birthday.getTime(), new Date(unserialized.birthday).getTime());
    });
});