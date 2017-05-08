"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = require("ava");
const parse_1 = require("../../../src/parse");
ava_1.test('min', t => {
    const { foo } = parse_1.default(`
    interface Foo {
      foo: number; // ##min: 42
    }
  `).get('Foo').factory();
    t.true(foo >= 42);
});
ava_1.test('max', t => {
    const { foo } = parse_1.default(`
    interface Foo {
      foo: number; // ##max: 122
    }
  `).get('Foo').factory();
    t.true(foo <= 122);
});
ava_1.test('min and max', t => {
    const { foo } = parse_1.default(`
    interface Foo {
      foo: number; // ##min: 10, max: 100
    }
  `).get('Foo').factory();
    t.true(foo >= 10);
    t.true(foo <= 100);
});
