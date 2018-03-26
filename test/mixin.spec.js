/* eslint-env mocha */
import mix from '../src/mixin.js';

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

describe('Unit: Mixin', () => {
    describe('class creation', () => {
        const PersonClass = mix().with(mixin);
        let person = new PersonClass();
        person.name = 'Alan';

        it('should extend a class', () => {
            assert.equal(person.name, 'Alan');
            assert.equal(person.lastName, 'Turing');
            assert.equal(person.fullName, 'Alan Turing');
        });
    });

    describe('class extension', () => {
        const PersonClass = mix(SuperClass).with(mixin);
        let person = new PersonClass('Alan');

        it('should extend a class', () => {
            assert.equal(person.name, 'Alan');
            assert.equal(person.lastName, 'Turing');
            assert.equal(person.fullName, 'Alan Turing');
            assert.equal(person.isPerson(), true);
        });
    });

    describe('is mixed', () => {
        const PersonClass = mix(SuperClass).with(mixin);

        it('should extend a class', () => {
            assert(mix(PersonClass).has(mixin));
            assert(!mix(PersonClass).has(() => {}));
        });
    });
});
