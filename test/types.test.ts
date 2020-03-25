import {
  _V,
  _String,
  _Number,
  _Array,
  _Shape,
  _Eval,
  _Null,
  _Undefined,
  _Constant,
  _Unknown,
  _Any
} from '../src/types'

type AssertTrue<A, B> = A extends B ? (B extends A ? 'pass' : 'fail') : 'fail'
type AssertFalse<A, B> = AssertTrue<A, B> extends 'fail' ? 'pass' : 'fail'
type Tests<T extends 'pass'[]> = T

export type tests = Tests<
  [
    AssertTrue<'1', '1'>,
    AssertTrue<_Eval<_Null>, null>,
    AssertTrue<_Eval<_Undefined>, undefined>,
    AssertTrue<_Eval<_String>, string>,
    AssertTrue<_Eval<_Number>, number>,
    AssertTrue<_Eval<_Any>, any>,
    AssertTrue<_Eval<_Unknown>, unknown>,
    AssertTrue<_Eval<_Constant<'foo'>>, 'foo'>,
    AssertFalse<_Eval<_Constant<'foo'>>, string>,
    AssertTrue<_Eval<_Array<_String>>, string[]>,
    AssertTrue<_Eval<_Shape<{ foo: _String; bar: _Number }>>, { foo: string; bar: number }>,
    AssertTrue<
      _Eval<_Shape<{ foo: _Shape<{ one: _Array<_Constant<'CONST'>> }>; bar: _Number }>>,
      { foo: { one: 'CONST'[] }; bar: number }
    >
  ]
>

test('Types compile', () => expect(true).toBe(true))
