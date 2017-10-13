/* eslint-env mocha */
import Observable from '../src/observable.js';

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

        before(() => {
            observable.firstName = 'Alan';
            observable.lastName = 'Skywalker';
            return Promise.resolve();
        });

        it('should trigger changes', () => {
            assert.equal(changes.length, 1);
        });

        it('should not trigger changes if object is not changed', () => {
            let change = changes.find((c) => c.property === 'name');
            assert(!change);
        });

        it('should trigger changes if object has been updated', () => {
            let change = changes.find((c) => c.property === 'lastName');
            assert.equal(change.value, 'Skywalker');
            assert.equal(change.oldValue, 'Turing');
        });
    });

    describe('simple Array', () => {
        let changes = [];
        let observable = new Observable([
            'Anakin',
            'Luke',
            'Padme',
        ]);

        observable.on('change', (changset) => {
            changes.push(changset);
        });

        before(() => {
            observable[0] = 'Darth Vader';
            observable[1] = 'Luke';
            observable[2] = 'Leia';
            observable.pop();
            observable.push('Leia', 'Han Solo');
            return Promise.resolve();
        });

        it('should trigger changes', () => {
            assert.equal(changes.length, 4);
        });

        it('should not trigger changes if object is not changed', () => {
            let change = changes.find((c) => c.property == 1);
            assert(!change);
        });

        it('should trigger changes if object has been updated', () => {
            let change = changes[0];
            assert.equal(change.value, 'Darth Vader');
            assert.equal(change.oldValue, 'Anakin');
        });

        it('should trigger changes for array functions', () => {
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
        });
    });

    describe('complex objects', () => {
        let changes = [];
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

        observable.on('change', (changset) => {
            changes.push(changset);
        });

        before(() => {
            observable.prop1 = 2;
            observable.prop2.push('c');
            observable.prop3.prop3_1 = 2;
            observable.prop3.prop3_2.pop();
            observable.prop4[0].prop4_1 = 2;
            observable.prop4[1].prop4_2.push({
                prop6: 5,
            });
            observable.prop4[1].prop4_2[0].prop6 = 10;
            return Promise.resolve();
        });

        it('should trigger changes', () => {
            assert.equal(changes.length, 7);
        });

        it('should compute property name', () => {
            let paths = changes.map((change) => change.property);
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
});
