"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = require("ava");
const parse_1 = require("../../../src/parse");
ava_1.test('minLength', t => {
    const { foo } = parse_1.default(`
    interface Foo {
      foo: string; // ##minLength: 10
    }
  `).get('Foo').factory();
    t.true(foo.split(' ').length >= 10);
});
ava_1.test('maxLength', t => {
    const { foo } = parse_1.default(`
    interface Foo {
      foo: string; // ##maxLength: 100
    }
  `).get('Foo').factory();
    t.true(foo.split(' ').length <= 100);
});
ava_1.test('length', t => {
    const { foo } = parse_1.default(`
    interface Foo {
      foo: string; // ##length: 18
    }
  `).get('Foo').factory();
    t.is(foo.split(' ').length, 18);
});
ava_1.test('minLength and maxLength', t => {
    const { foo } = parse_1.default(`
    interface Foo {
      foo: string; // ##minLength: 20, maxLength: 120
    }
  `).get('Foo').factory();
    const length = foo.split(' ').length;
    t.true(length >= 20);
    t.true(length <= 120);
});
