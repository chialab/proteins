import { assert } from '@chialab/ginsenghino';
import { mix } from '@chialab/proteins';

class SuperClass {
    constructor(name) {
        this.name = name;
    }

    isPerson() {
        return true;
    }
}

const mixin = (Super) => class extends Super {
    constructor(name) {
        super(name);
        this.lastName = 'Turing';
    }

    get fullName() {
        return `${this.name} ${this.lastName}`;
    }
};

const mixin2 = (Super) => class extends mix(Super).with(mixin) { };

describe('Unit: Mixin', () => {
    describe('class creation', () => {
        it('should extend a class', () => {
            const PersonClass = mix().with(mixin);
            const person = new PersonClass();
            person.name = 'Alan';

            assert.equal(person.name, 'Alan');
            assert.equal(person.lastName, 'Turing');
            assert.equal(person.fullName, 'Alan Turing');
        });
    });

    describe('class extension', () => {
        it('should extend a class', () => {
            const PersonClass = mix(SuperClass).with(mixin);
            const person = new PersonClass('Alan');

            assert.equal(person.name, 'Alan');
            assert.equal(person.lastName, 'Turing');
            assert.equal(person.fullName, 'Alan Turing');
            assert.equal(person.isPerson(), true);
        });
    });

    describe('is mixed', () => {
        it('should extend a class', () => {
            const MiddleClass = mix(SuperClass).with(mixin);
            const PersonClass = mix(MiddleClass).with(mixin2);

            assert(mix(PersonClass).has(mixin));
            assert(mix(PersonClass).has(mixin2));
            assert(!mix(PersonClass).has(() => { }));
            assert(mix(MiddleClass).has(mixin));
            assert(!mix(MiddleClass).has(mixin2));
            assert(!mix(SuperClass).has(mixin));
            assert(!mix(SuperClass).has(mixin2));
        });
    });
});
