import { P, ValidType } from './types'

type AssertTrue<A, B> = A extends B ? (B extends A ? 'pass' : 'fail') : 'fail'
type Tests<T extends 'pass'[]> = T

test('Type inferance', () => {
  const result: Tests<[
    AssertTrue<'1', '1'>,
    AssertTrue<ValidType<P.String>, string>,
    AssertTrue<ValidType<P.Number>, number>,
    AssertTrue<ValidType<P.Null>, null>,
    AssertTrue<ValidType<P.Undefined>, undefined>,
    AssertTrue<ValidType<P.Array<P.Number>>, number[]>,
    AssertTrue<ValidType<P.Shape<{ n: P.Number }>>, { n: number }>,
    AssertTrue<ValidType<P.Infer<{ n: string }>>, { n: string }>
  ]> = ['pass', 'pass', 'pass', 'pass', 'pass', 'pass', 'pass', 'pass']

  expect(result).toEqual(result)
})
