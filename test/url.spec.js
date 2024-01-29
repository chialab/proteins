import { Url } from '@chialab/proteins';
import { assert, describe, expect, test } from 'vitest';

describe('Unit: Url', () => {
    test('should check url validity', () => {
        expect(() => new Url.Url('local.host')).not.toThrow();
        expect(() => new Url.Url('local.host:80')).not.toThrow();
        expect(() => new Url.Url('//local.host')).not.toThrow();
        expect(() => new Url.Url('//local.host:80')).not.toThrow();
        expect(() => new Url.Url('http://localhost/')).not.toThrow();
        expect(() => new Url.Url('http://localhost:80')).not.toThrow();
        expect(() => new Url.Url('127.0.0.1')).not.toThrow();
        expect(() => new Url.Url('127.0.0.1:8080')).not.toThrow();
        expect(() => new Url.Url('/posts')).not.toThrow();
        expect(() => new Url.Url('/posts?size=50')).not.toThrow();
        expect(() => new Url.Url('/posts?size=50&help')).not.toThrow();
        expect(() => new Url.Url('/posts?size=50/help')).not.toThrow();
        expect(() => new Url.Url('file:///')).not.toThrow();
        expect(() => new Url.Url('[::1]'), '[::1]').not.toThrow();
        expect(() => new Url.Url('[::1]:8080'), '[::1]:8080').not.toThrow();
        expect(() => new Url.Url('http://[2a00:1450:4002:809::200e]')).not.toThrow();
        expect(() => new Url.Url('https://user:pass@[::1]:443/path?query#id')).not.toThrow();
        expect(() => new Url.Url('http://')).toThrow(SyntaxError);
        expect(() => new Url.Url(':80')).toThrow(SyntaxError);
        expect(() => new Url.Url('http:///')).toThrow(SyntaxError);
        expect(() => new Url.Url('http://:80')).toThrow(SyntaxError);
        expect(() => new Url.Url('?size=50')).toThrow(SyntaxError);
        expect(() => new Url.Url('?size=50/help')).toThrow(SyntaxError);
        // unhandled yet
    });

    test('should get information on a base url', () => {
        const url = new Url.Url('http://www.chialab.it:80/posts?size=10');

        expect(url.href, 'http://www.chialab.it:80/posts?size=10');
        expect(url.protocol).toBe('http:');
        expect(url.hostname).toBe('www.chialab.it');
        expect(url.port).toBe('80');
        expect(url.host).toBe('www.chialab.it:80');
        expect(url.search).toBe('?size=10');
        expect(url.origin).toBe('http://www.chialab.it:80');

        assert(new Url.Url('http://www.chialab.it:80').isAbsoluteUrl());
        assert(new Url.Url('mailto:test@test.com').isAbsoluteUrl());
        assert(new Url.Url('tel:5555').isAbsoluteUrl());
        assert(!new Url.Url('http://www.chialab.it:80').isDataUrl());
        assert(!new Url.Url('http://www.chialab.it:80').isLocalUrl());
        assert(!new Url.Url('/posts').isAbsoluteUrl());
        assert(!new Url.Url('/posts').isDataUrl());
        assert(!new Url.Url('/posts').isLocalUrl());
        assert(new Url.Url('file:///').isAbsoluteUrl());
        assert(!new Url.Url('file:///').isDataUrl());
        assert(new Url.Url('file:///').isLocalUrl());
    });

    test('should exec operations on search path', () => {
        const url = new Url.Url('http://www.chialab.it:80/posts?size=10');
        const searchParams = url.searchParams;

        expect(searchParams.entries()).toHaveLength(1);
        expect(searchParams.get('size'), '10');

        searchParams.delete('size');
        assert.equal(searchParams.entries().length, 0);
        assert.equal(searchParams.get('size'), undefined);

        searchParams.set('size', 2);
        searchParams.set('size', 11);

        expect(searchParams.entries()).toHaveLength(1);
        expect(searchParams.get('size')).toBe('11');

        searchParams.set('order', 1);
        searchParams.set('page', 2);

        expect(searchParams.entries()).toHaveLength(3);
        expect(searchParams.keys()).toEqual(['size', 'order', 'page']);
        expect(searchParams.values()).toEqual(['11', '1', '2']);

        searchParams.sort();
        expect(searchParams.entries()).toHaveLength(3);
        expect(searchParams.keys()).toEqual(['order', 'page', 'size']);
        expect(searchParams.values()).toEqual(['1', '2', '11']);

        assert(searchParams.has('size'));
        assert(searchParams.has('page'));
        assert(!searchParams.has('name'));

        expect(searchParams.toString()).toBe('?order=1&page=2&size=11');
        expect(url.toString()).toBe('http://www.chialab.it:80/posts?order=1&page=2&size=11');
    });

    test('should resolve locations', () => {
        const url = new Url.Url('/posts', 'chialab.it');

        expect(url.href).toBe('chialab.it/posts');

        const url2 = url.join('2', 'info');
        expect(url2.href).toBe('chialab.it/posts/2/info');

        const url3 = url2.resolve('../3/info');
        expect(url3.href).toBe('chialab.it/posts/3/info');

        const url4 = url3.resolve('./edit');
        expect(url4.href).toBe('chialab.it/posts/3/edit');

        const url5 = Url.resolve('https://example.com/index.html', '/callback.html');
        expect(url5).toBe('https://example.com/callback.html');

        const url6 = Url.resolve('https://example.com/index.html', 'callback.html');
        expect(url6).toBe('https://example.com/callback.html');

        expect(() => new Url.Url('/posts').resolve('/article')).toThrow();
    });

    test('should serialize objects', () => {
        const person = {
            firstName: 'Alan',
            age: 21,
            birthday: new Date('1912-06-11T22:00:00.000Z'),
            filter: {
                tags: ['math'],
                jobs: {},
            },
        };
        const serialized = Url.serialize(person);
        const unserialized = Url.unserialize(serialized);

        expect(serialized).toBe(
            `firstName=Alan&age=21&birthday=${encodeURIComponent('1912-06-11T22:00:00.000Z')}&${encodeURIComponent('filter[tags][0]')}=math&${encodeURIComponent('filter[jobs]')}`
        );
        expect(person.firstName).toBe(unserialized.firstName);
        expect(person.age).toBe(parseInt(unserialized.age));
        expect(person.birthday.getTime()).toBe(new Date(unserialized.birthday).getTime());
    });

    test('should serialize empty objects', () => {
        const person = {
            firstName: undefined,
        };
        const serialized = Url.serialize(person);

        expect(serialized).toBe('');
    });

    test('should unserialize complex string', () => {
        const serialized = 'filter[name]=Alan&filter[geo][latitude]=41&filter[type]=person&size=1&filter[tags][]=math';
        const unserialized = Url.unserialize(serialized);
        expect(unserialized).toEqual({
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
