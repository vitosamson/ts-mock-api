import { test } from 'ava';
import parse from '../../../src/parse';

test('minLength', t => {
  const { foo } = parse(`
    interface Foo {
      foo: string; // @minLength: 10
    }
  `).get('Foo').factory();

  t.true((foo as string).split(' ').length >= 10);
});

test('maxLength', t => {
  const { foo } = parse(`
    interface Foo {
      foo: string; // @maxLength: 100
    }
  `).get('Foo').factory();

  t.true((foo as string).split(' ').length <= 100);
});

test('length', t => {
  const { foo } = parse(`
    interface Foo {
      foo: string; // @length: 18
    }
  `).get('Foo').factory();

  t.is((foo as string).split(' ').length, 18);
});

test('minLength and maxLength', t => {
  const { foo } = parse(`
    interface Foo {
      foo: string; // @minLength: 20, maxLength: 120
    }
  `).get('Foo').factory();

  const length = (foo as string).split(' ').length;
  t.true(length >= 20);
  t.true(length <= 120);
});
