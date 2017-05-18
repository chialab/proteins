/* eslint-env mocha */
import { Url, serialize, unserialize } from '../src/url.js';

describe('Unit: Url', () => {
    it('should check url validity', () => {
        assert.doesNotThrow(() => new Url('local.host'));
        assert.doesNotThrow(() => new Url('local.host:80'));
        assert.doesNotThrow(() => new Url('//local.host'));
        assert.doesNotThrow(() => new Url('//local.host:80'));
        assert.doesNotThrow(() => new Url('http://localhost'));
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
    });

    it('should serialize simple string', () => {
        let person = {
            firstName: 'Alan',
            age: 21,
            birthday: new Date('1912-06-11T22:00:00.000Z'),
        };
        let serialized = serialize(person);
        let unserialized = unserialize(serialized);

        assert.equal(serialized, `firstName=Alan&age=21&birthday=${encodeURIComponent('1912-06-11T22:00:00.000Z')}`);
        assert.equal(person.firstName, unserialized.firstName);
        assert.equal(person.age, unserialized.age);
        assert.equal(person.birthday.getTime(), new Date(unserialized.birthday).getTime());
    });
});
