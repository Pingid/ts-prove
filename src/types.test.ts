import {
  _V,
  _String,
  _Number,
  _Array,
  _Shape,
  _Null,
  _Undefined,
  _Deconstruct,
  _Infer,
} from '../src/types'

type AssertTrue<A, B> = A extends B ? (B extends A ? 'pass' : 'fail') : 'fail'
type AssertFalse<A, B> = AssertTrue<A, B> extends 'fail' ? 'pass' : 'fail'
type Tests<T extends 'pass'[]> = T

test('Types compile', () => {
  type tests = Tests<
    [
      AssertTrue<'1', '1'>,
      AssertTrue<_Deconstruct<_String>, string>,
      AssertTrue<_Deconstruct<_Number>, number>,
      AssertTrue<_Deconstruct<_Null>, null>,
      AssertTrue<_Deconstruct<_Undefined>, undefined>,
      AssertTrue<_Deconstruct<_Array<_Number>>, number[]>,
      AssertTrue<_Deconstruct<_Shape<{ n: _Number }>>, { n: number }>,
      AssertTrue<_Deconstruct<_Infer<{ n: string }>>, { n: string }>,
      AssertTrue<_Deconstruct<_Infer<{ n: string }>>, { n: string }>
    ]
  >
  expect(true).toBe(true)
})
