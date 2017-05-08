"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = require("ava");
const parse_1 = require("../../src/parse");
ava_1.test('string literal', t => {
    t.deepEqual(parse_1.default(`interface Foo { foo: 'bar'; }`).get('Foo').factory(), { foo: 'bar' });
});
ava_1.test('number literal', t => {
    t.deepEqual(parse_1.default(`interface Foo { foo: 10 }`).get('Foo').factory(), { foo: 10 });
});
ava_1.test('string', t => {
    const { foo } = parse_1.default(`interface Foo { foo: string }`).get('Foo').factory();
    t.is(typeof foo, 'string');
});
ava_1.test('number', t => {
    const { foo } = parse_1.default(`interface Foo { foo: number `).get('Foo').factory();
    t.is(typeof foo, 'number');
});
