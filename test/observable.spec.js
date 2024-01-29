import { Observable, Symbolic } from '@chialab/proteins';
import { assert, beforeEach, describe, expect, test } from 'vitest';

describe('Unit: Observable', () => {
    describe('simple object', () => {
        let observable;
        let changes;

        beforeEach(() => {
            changes = [];

            observable = new Observable({
                firstName: 'Alan',
                lastName: 'Turing',
                birthday: new Date('1912/06/23'),
            });

            observable.on('change', (changset) => {
                changes.push(changset);
            });
        });

        test('should not trigger changes if object is not changed', () => {
            observable.firstName = 'Alan';

            expect(changes).toHaveLength(0);
        });

        test('should trigger changes if object has been updated', () => {
            observable.lastName = 'Skywalker';

            const change = changes[0];
            expect(change.value).toBe('Skywalker');
            expect(change.oldValue).toBe('Turing');
            expect(changes).toHaveLength(1);
        });

        // Regression test for a bug on IE:
        // without defining a value for `enumerable` while using `Object.defineProperty`
        // in `ProxyHelper`, IE can't recognize object properties and is not be able to JSON.stringify the object.
        test('should correctly proxy an object', () => {
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
            expect(JSON.stringify(dreamTheater)).toBe(JSON.stringify(observableDreamTheater));
        });

        test('should correctly proxy an object with an array property', () => {
            const bucciaratiCrew = {
                members: [
                    'Bruno Bucciarati',
                    'Giorno Giovanna',
                    'Guido Mista',
                    'Narancia Ghirga',
                    'Leone Abbacchio',
                    'Pannacotta Fugo',
                ],
                stands: ['Sticky Fingers', 'Gold Experience', 'Sex Pistols', 'Aerosmith', 'Moody Blues', 'Purple Haze'],
            };

            const observable = new Observable(bucciaratiCrew);
            expect(observable.members).toBeInstanceOf(Array);
            expect(observable.stands).toBeInstanceOf(Array);
        });
    });

    describe('simple Array', () => {
        let observable;
        let changes;

        beforeEach(() => {
            changes = [];
            observable = new Observable(['Luke', 'Anakin', 'Padme']);

            observable.on('change', (changset) => {
                changes.push(changset);
            });
        });

        test('should not trigger changes if object is not changed', () => {
            observable[0] = 'Luke';

            expect(changes).toHaveLength(0);
            expect(observable.length).toBe(3);
        });

        test('should trigger changes if object has been updated', () => {
            observable[0] = 'Luke';
            observable[1] = 'Darth Vader';

            expect(changes[0].value).toBe('Darth Vader');
            expect(changes[0].oldValue).toBe('Anakin');
        });

        test('should trigger changes for array functions', () => {
            observable[0] = 'Luke';
            observable[1] = 'Darth Vader';
            observable[2] = 'Leia';
            observable.pop();
            observable.push('Leia', 'Han Solo');

            expect(changes[1].property).toBe('2');
            expect(changes[1].oldValue).toBe('Padme');
            expect(changes[1].value).toBe('Leia');
            expect(changes[2].property).toBe(2);
            expect(changes[2].added.length).toBe(0);
            expect(changes[2].removed.length).toBe(1);
            expect(changes[2].removed[0]).toBe('Leia');
            expect(changes[3].property).toBe(2);
            expect(changes[3].added).toHaveLength(2);
            expect(changes[3].removed).toHaveLength(0);
            expect(changes[3].added).toEqual(['Leia', 'Han Solo']);
            expect(observable).toHaveLength(4);
            expect(changes).toHaveLength(4);
        });

        test('should be of type Array', () => {
            assert(Array.isArray(observable));
        });
    });

    describe('complex objects', () => {
        let observable, observable2;
        let changes1;
        let changes2;

        beforeEach(() => {
            changes1 = [];
            changes2 = [];

            observable = new Observable({
                prop1: 1,
                prop2: ['a', 'b'],
                prop3: {
                    prop3_1: 1,
                    prop3_2: ['c', 'd'],
                },
                prop4: [{ prop4_1: 1 }, { prop4_2: [] }],
            });
            observable2 = new Observable(observable);

            observable.on('change', (changset) => {
                changes1.push(changset);
            });

            observable2.on('change', (changset) => {
                changes2.push(changset);
            });

            observable.prop1 = 2;
            observable.prop2.push('c');
            observable.prop3.prop3_1 = 2;
            observable.prop3.prop3_2.pop();
            observable.prop4[0].prop4_1 = 2;
            observable.prop4[1].prop4_2.push({
                prop6: 5,
            });
            observable.prop4[1].prop4_2[0].prop6 = 10;
        });

        test('should trigger changes', () => {
            expect(changes1).toHaveLength(7);
            expect(changes1).toEqual(changes2);
        });

        test('should compute property name', () => {
            const paths = changes1.map((change) => change.property);
            expect(paths).toEqual([
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
        test('should be ignored', () => {
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
            expect(changes).toHaveLength(1);
        });
    });

    describe('not Observable objects', () => {
        test('should throw an exception', () => {
            expect(() => new Observable(null)).toThrow();
            expect(() => new Observable(2)).toThrow();
            expect(() => new Observable('hello')).toThrow();
            expect(() => new Observable(undefined)).toThrow();
            expect(() => new Observable(NaN)).toThrow();
        });
    });

    describe('Observable of observable objects', () => {
        test('should handle observable of observable', () => {
            expect(() => new Observable(new Observable({}))).not.toThrow();
        });
    });

    describe('Observable object with thousands of instances', () => {
        test('should not crash in Firefox', () => {
            expect(() => {
                const obj = [[], [], [], [], [], [], [], [], []];
                let obs = new Observable(obj);
                for (let i = 0; i < 3000; i++) {
                    obs = new Observable(obs);
                }
            }).not.toThrow();
        });
    });

    describe('Reobserve object when adding properties', () => {
        test('should trigger changes', () => {
            const observable = new Observable({ foo: 'foo' });
            const changes = [];
            observable.on('change', (changeset) => {
                changes.push(changeset);
            });
            observable.bar = 'bar';
            observable.baz = 'baz';
            Observable.reobserve(observable);

            expect(changes).toEqual([
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
