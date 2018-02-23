/* eslint-env mocha */
import Observable from '../src/observable.js';
import Symbolic from '../src/symbolic.js';

describe('Unit: Observable', () => {
    describe('simple object', () => {
        let changes = [];
        let observable = new Observable({
            firstName: 'Alan',
            lastName: 'Turing',
            birthday: new Date('1912/06/23'),
        });

        observable.on('change', (changset) => {
            changes.push(changset);
        });

        before((done) => {
            observable.firstName = 'Alan';
            observable.lastName = 'Skywalker';
            setTimeout(done, 100);
        });

        it('should trigger changes if object has been updated', () => {
            assert.equal(changes[0].value, 'Skywalker');
            assert.equal(changes[0].oldValue, 'Turing');
            assert.equal(changes.length, 1);
        });
    });

    describe('simple Array', () => {
        let changes = [];
        let observable = new Observable([
            'Luke',
            'Anakin',
            'Padme',
        ]);

        observable.on('change', (changset) => {
            changes.push(changset);
        });

        before((done) => {
            observable[0] = 'Luke';
            observable[1] = 'Darth Vader';
            observable[2] = 'Leia';
            observable.pop();
            observable.push('Leia', 'Han Solo');
            setTimeout(done, 100);
        });

        it('should trigger changes if object has been updated', () => {
            assert.equal(changes[0].value, 'Darth Vader');
            assert.equal(changes[0].oldValue, 'Anakin');
            assert.equal(changes[1].property, '2');
            assert.equal(changes[1].oldValue, 'Padme');
            assert.equal(changes[1].value, 'Leia');
            assert.equal(changes[2].property, '2');
            assert.equal(changes[2].added.length, 0);
            assert.equal(changes[2].removed.length, 1);
            assert.equal(changes[2].removed[0], 'Leia');
            assert.equal(changes[3].property, '2');
            assert.equal(changes[3].added.length, 2);
            assert.equal(changes[3].removed.length, 0);
            assert.deepEqual(changes[3].added, ['Leia', 'Han Solo']);
            assert.equal(observable.length, 4);
            assert.equal(changes.length, 4);
        });
    });

    describe('complex objects', () => {
        let changes1 = [];
        let changes2 = [];
        let observable = new Observable({
            prop1: 1,
            prop2: ['a', 'b'],
            prop3: {
                prop3_1: 1,
                prop3_2: ['c', 'd'],
            },
            prop4: [
                { prop4_1: 1 },
                { prop4_2: [] },
            ],
        });
        let observable2 = new Observable(observable);

        observable.on('change', (changset) => {
            changes1.push(changset);
        });

        observable2.on('change', (changset) => {
            changes2.push(changset);
        });

        before((done) => {
            observable.prop1 = 2;
            observable.prop2.push('c');
            observable.prop3.prop3_1 = 2;
            observable.prop3.prop3_2.pop();
            observable.prop4[0].prop4_1 = 2;
            observable.prop4[1].prop4_2.push({
                prop6: 5,
            });
            observable.prop4[1].prop4_2[0].prop6 = 10;
            setTimeout(done, 100);
        });

        it('should trigger changes', () => {
            assert.equal(changes1.length, 7);
            assert.deepEqual(changes1, changes2);
        });

        it('should compute property name', () => {
            let paths = changes1.map((change) => change.property);
            assert.deepEqual(paths, [
                'prop1',
                'prop2.2',
                'prop3.prop3_1',
                'prop3.prop3_2.1',
                'prop4.0.prop4_1',
                'prop4.1.prop4_2.0',
                'prop4.1.prop4_2.0.prop6',
            ]);
        });
    });

    describe('symbolic keys', () => {
        let changes = [];
        let sym = Symbolic('tags');
        let observable = new Observable({
            name: 'Alan',
            [sym]: ['math'],
        });

        observable.on('change', (changset) => {
            changes.push(changset);
        });

        before((done) => {
            observable[sym] = [];
            observable.name = 'Steve';
            setTimeout(done, 100);
        });

        it('should be ignored', () => {
            assert.equal(changes.length, 1);
        });
    });

    describe('not Observable objects', () => {
        it('should throw an exception', () => {
            assert.throws(() => new Observable(null));
            assert.throws(() => new Observable(2));
            assert.throws(() => new Observable('hello'));
            assert.throws(() => new Observable(undefined));
            assert.throws(() => new Observable(NaN));
        });
    });

    describe('Observable object with thousands of instances', () => {
        it('should not crash in Firefox', () => {
            assert.doesNotThrow(() => {
                let obj = [[], [], [], [], [], [], [], [], []];
                let obs = new Observable(obj);
                for (let i = 0; i < 3000; i++) {
                    obs = new Observable(obs);
                }
            });
        });
    });

    describe('Reobserve object when adding properties', () => {
        const observable = new Observable({ foo: 'foo' });
        const changes = [];

        observable.on('change', changeset => {
            changes.push(changeset);
        });

        before((done) => {
            observable.bar = 'bar';
            observable.baz = 'baz';
            Observable.reobserve(observable);
            setTimeout(done, 100);
        });

        it('should trigger changes', () => {
            assert.deepEqual(changes, [
                {
                    property: 'bar',
                    oldValue: undefined,
                    value: 'bar',
                },
                {
                    property: 'baz',
                    oldValue: undefined,
                    value: 'baz',
                },
            ]);
        });
    });
});
