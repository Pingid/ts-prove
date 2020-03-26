import P, { InferProof } from './types'

type AssertTrue<A, B> = A extends B ? (B extends A ? 'pass' : 'fail') : 'fail'
type AssertFalse<A, B> = AssertTrue<A, B> extends 'fail' ? 'pass' : 'fail'
type Tests<T extends 'pass'[]> = T

test('Types compile', () => {
  type tests = Tests<
    [
      AssertTrue<'1', '1'>,
      AssertTrue<InferProof<P.String>, string>,
      AssertTrue<InferProof<P.Number>, number>,
      AssertTrue<InferProof<P.Null>, null>,
      AssertTrue<InferProof<P.Undefined>, undefined>,
      AssertTrue<InferProof<P.Array<P.Number>>, number[]>,
      AssertTrue<InferProof<P.Shape<{ n: P.Number }>>, { n: number }>,
      AssertTrue<InferProof<P.Infer<{ n: string }>>, { n: string }>,
      AssertTrue<InferProof<P.Infer<{ n: string }>>, { n: string }>
    ]
  >
  expect(true).toBe(true)
})
