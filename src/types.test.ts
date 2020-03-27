import { P, Unwrap } from './types'

/** @internal
 * Typescript type testing framework
 */
type AssertTrue<A, B> = A extends B ? (B extends A ? 'pass' : 'fail') : 'fail'

test('Type inferance', () => {
  type Tests<T extends 'pass'[]> = T

  const result: Tests<[
    AssertTrue<'1', '1'>,
    AssertTrue<Unwrap<P.String>, string>,
    AssertTrue<Unwrap<P.Number>, number>,
    AssertTrue<Unwrap<P.Null>, null>,
    AssertTrue<Unwrap<P.Undefined>, undefined>,
    AssertTrue<Unwrap<P.Array<P.Number>>, number[]>,
    AssertTrue<Unwrap<P.Shape<{ n: P.Number }>>, { n: number }>,
    AssertTrue<Unwrap<P.Infer<{ n: string }>>, { n: string }>
  ]> = ['pass', 'pass', 'pass', 'pass', 'pass', 'pass', 'pass', 'pass']

  expect(result).toEqual(result)
})
