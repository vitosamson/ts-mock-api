import { test } from 'ava';
import parse from '../../src/parse';

test('string literal', t => {
  t.deepEqual(
    parse(`interface Foo { foo: 'bar'; }`).get('Foo').factory(),
    { foo: 'bar' },
  );
});

test('number literal', t => {
  t.deepEqual(
    parse(`interface Foo { foo: 10 }`).get('Foo').factory(),
    { foo: 10 },
  );
});

test('string', t => {
  const { foo } = parse(`interface Foo { foo: string }`).get('Foo').factory();
  t.is(typeof foo, 'string');
});

test('number', t => {
  const { foo } = parse(`interface Foo { foo: number `).get('Foo').factory();
  t.is(typeof foo, 'number');
});
