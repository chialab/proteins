import { assert } from '@chialab/ginsenghino';
import { Observable, Symbolic, isArray } from '@chialab/proteins';

describe('Unit: Observable', () => {
    describe('simple object', () => {
        let observable;
        const changes = [];

        before(() => {
            observable = new Observable({
                firstName: 'Alan',
                lastName: 'Turing',
                birthday: new Date('1912/06/23'),
            });

            observable.on('change', (changset) => {
                changes.push(changset);
            });
        });

        it('should not trigger changes if object is not changed', () => {
            observable.firstName = 'Alan';

            assert.equal(changes.length, 0);
        });

        it('should trigger changes if object has been updated', () => {
            observable.lastName = 'Skywalker';

            const change = changes[0];
            assert.equal(change.value, 'Skywalker');
            assert.equal(change.oldValue, 'Turing');
        });

        it('should trigger changes', () => {
            assert.equal(changes.length, 1);
        });

        // Regression test for a bug on IE:
        // without defining a value for `enumerable` while using `Object.defineProperty`
        // in `ProxyHelper`, IE can't recognize object properties and is not be able to JSON.stringify the object.
        it('should correctly proxy an object', () => {
            const dreamTheater = {
                members: {
                    guitar: 'John Petrucci',
                    bass: 'John Myung',
                    drum: 'Mike Mangini',
                    keyboard: 'Jordan Rudess',
                    vocals: 'James LaBrie',
                },
            };
            const observableDreamTheater = new Observable(dreamTheater);
            assert.deepEqual(JSON.stringify(dreamTheater), JSON.stringify(observableDreamTheater));
        });

        it('should correctly proxy an object with an array property', () => {
            const bucciaratiCrew = {
                members: [
                    'Bruno Bucciarati',
                    'Giorno Giovanna',
                    'Guido Mista',
                    'Narancia Ghirga',
                    'Leone Abbacchio',
                    'Pannacotta Fugo',
                ],
                stands: [
                    'Sticky Fingers',
                    'Gold Experience',
                    'Sex Pistols',
                    'Aerosmith',
                    'Moody Blues',
                    'Purple Haze',
                ],
            };

            const observable = new Observable(bucciaratiCrew);
            assert(isArray(observable.members));
            assert(isArray(observable.stands));
        });
    });

    describe('simple Array', () => {
        const changes = [];
        let observable;

        before(() => {
            observable = new Observable([
                'Luke',
                'Anakin',
                'Padme',
            ]);

            observable.on('change', (changset) => {
                changes.push(changset);
            });
        });

        it('should not trigger changes if object is not changed', () => {
            observable[0] = 'Luke';

            assert.equal(changes.length, 0);
            assert.equal(observable.length, 3);
        });

        it('should trigger changes if object has been updated', () => {
            observable[1] = 'Darth Vader';

            const change = changes[0];
            assert.equal(change.value, 'Darth Vader');
            assert.equal(change.oldValue, 'Anakin');
        });

        it('should trigger changes for array functions', () => {
            observable[2] = 'Leia';
            observable.pop();
            observable.push('Leia', 'Han Solo');

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
        });

        it('should trigger changes', () => {
            assert.equal(changes.length, 4);
        });

        it('should be of type Array', () => {
            assert(Array.isArray(observable));
        });
    });

    describe('complex objects', () => {
        const changes1 = [];
        const changes2 = [];
        let observable, observable2;

        before(() => {
            observable = new Observable({
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
            observable2 = new Observable(observable);

            observable.on('change', (changset) => {
                changes1.push(changset);
            });

            observable2.on('change', (changset) => {
                changes2.push(changset);
            });
        });

        it('should trigger changes', () => {
            observable.prop1 = 2;
            observable.prop2.push('c');
            observable.prop3.prop3_1 = 2;
            observable.prop3.prop3_2.pop();
            observable.prop4[0].prop4_1 = 2;
            observable.prop4[1].prop4_2.push({
                prop6: 5,
            });
            observable.prop4[1].prop4_2[0].prop6 = 10;

            assert.equal(changes1.length, 7);
            assert.deepEqual(changes1, changes2);
        });

        it('should compute property name', () => {
            const paths = changes1.map((change) => change.property);
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
        it('should be ignored', () => {
            const changes = [];
            const sym = Symbolic('tags');
            const observable = new Observable({
                name: 'Alan',
                [sym]: ['math'],
            });

            observable.on('change', (changset) => {
                changes.push(changset);
            });

            observable[sym] = [];
            observable.name = 'Steve';
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

    describe('Observable of observable objects', () => {
        it('should handle observable of observable', () => {
            assert.doesNotThrow(() => new Observable(new Observable({})));
        });
    });

    describe('Observable object with thousands of instances', () => {
        it('should not crash in Firefox', () => {
            assert.doesNotThrow(() => {
                const obj = [[], [], [], [], [], [], [], [], []];
                let obs = new Observable(obj);
                for (let i = 0; i < 3000; i++) {
                    obs = new Observable(obs);
                }
            });
        });
    });

    describe('Reobserve object when adding properties', () => {
        it('should trigger changes', () => {
            const observable = new Observable({ foo: 'foo' });
            const changes = [];
            observable.on('change', changeset => {
                changes.push(changeset);
            });
            observable.bar = 'bar';
            observable.baz = 'baz';
            Observable.reobserve(observable);

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
