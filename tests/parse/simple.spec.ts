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

test('typeLiteral', t => {
  const { foo } = parse(`
    interface Foo {
      foo: {
        bar: 'foo bar';
      };
    }
  `).get('Foo').factory();
  t.deepEqual(foo, { bar: 'foo bar' });
});

test('nested typeLiteral', t => {
  const { foo } = parse(`
    interface Foo {
      foo: {
        bar: {
          baz: 'blah';
        };
      };
    };
  `).get('Foo').factory();

  t.deepEqual(foo, {
    bar: {
      baz: 'blah',
    },
  });
});

test('array simple type', t => {
  const { foo } = parse(`
    interface Foo {
      foo: string[];
    }
  `).get('Foo').factory();

  t.true(Array.isArray(foo));
  t.true((foo as string[]).every(f => typeof f === 'string'));
});

/**
 * TODO:
 * Array<{}> gets treated as a TypeRef rather than an array expressions
 * currently unsupported
 */

test('array type ref', t => {
  const { foo } = parse(`
    interface Foo {
      foo: Bar[];
    }

    interface Bar {
      bar: 'baz';
    }
  `).get('Foo').factory();

  t.true(Array.isArray(foo));
  t.true((foo as any[]).every(f => f.bar === 'baz'));
});
