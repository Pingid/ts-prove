import { P, Unwrap } from './types'

type AssertTrue<A, B> = A extends B ? (B extends A ? 'pass' : 'fail') : 'fail'
type Tests<T extends 'pass'[]> = T

test('Type inferance', () => {
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
