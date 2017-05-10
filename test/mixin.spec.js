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

const PersonClass = mix(SuperClass).with(mixin);

describe('Unit: Mixin', () => {
    let person = new PersonClass('Alan');

    it('should extend a class', () => {
        assert.equal(person.name, 'Alan');
        assert.equal(person.lastName, 'Turing');
        assert.equal(person.fullName, 'Alan Turing');
        assert.equal(person.isPerson(), true);
    });
});
