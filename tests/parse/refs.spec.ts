import { test } from 'ava';
import parse from '../../src/parse';

test('simple Array<T>', t => {
  const { foo } = parse(`
    interface Foo {
      foo: Array<string>;
    }
  `).get('Foo').factory();

  t.true(Array.isArray(foo));
  t.true((foo as string[]).every(f => typeof f === 'string'));
});

// test('complex Array<T>', t => {
//   const { bars } = parse(`
//     interface Foo {
//       bars: Array<Bar>;
//     }

//     interface Bar {
//       bar: number;
//     }
//   `).get('Foo').factory();

//   t.true(Array.isArray(bars));
// });
