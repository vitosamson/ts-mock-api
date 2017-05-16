import { test } from 'ava';
import parse from '../../../src/parse';

test('min', t => {
  const { foo } = parse(`
    interface Foo {
      foo: number; // @min: 42
    }
  `).get('Foo').factory();
  t.true(foo >= 42);
});

test('max', t => {
  const { foo } = parse(`
    interface Foo {
      foo: number; // @max: 122
    }
  `).get('Foo').factory();
  t.true(foo <= 122);
});

test('min and max', t => {
  const { foo } = parse(`
    interface Foo {
      foo: number; // @min: 10, max: 100
    }
  `).get('Foo').factory();
  t.true(foo >= 10);
  t.true(foo <= 100);
});
