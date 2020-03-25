export enum TV {
  STRING = 'STRING',
  NUMBER = 'NUMBER',
  UNDEFINED = 'UNDEFINED',
  NULL = 'NULL',
  UNKNOWN = 'UNKNOWN',
  CONSTANT = 'CONSTANT',
  ANY = 'ANY',
  SHAPE = 'SHAPE',
  ARRAY = 'ARRAY',
  EQUAL = 'EQUAL',
  OR = 'OR'
}

export type _Construct<T, P = undefined> = {
  type: T
  validate: (x: unknown, depth?: number) => string | true
}
export type _Deconstruct<T extends _V> = T extends _Construct<infer A, infer B> ? [A, B] : never

export type _String = _Construct<TV.STRING, string>
export type _Number = _Construct<TV.NUMBER, number>
export type _Null = _Construct<TV.NULL, null>
export type _Undefined = _Construct<TV.UNDEFINED, undefined>
export type _Unknown = _Construct<TV.UNKNOWN, unknown>
export type _Any = _Construct<TV.ANY, any>

export type _Or<T extends _V[]> = _Construct<TV.OR, T>
export type _Constant<T extends string> = _Construct<TV.CONSTANT, T>
export type _Array<T extends _V> = _Construct<TV.ARRAY, T>
export type _Shape<T extends { [x: string]: _V }> = _Construct<TV.SHAPE, T>

export type _Prim = _Number | _String | _Null | _Undefined | _Unknown | _Any | _Constant<any>
export type _V = _Prim | _Array<any> | _Shape<any> | _Or<any>

export type _Eval<T extends _V> = T extends _Prim
  ? _Deconstruct<T>[1]
  : {
      shape: { [Key in keyof _Deconstruct<T>[1]]: _Eval<_Deconstruct<T>[1][Key]> }
      array: _Eval<_Deconstruct<T>[1]>[]
      or: _Eval<_Deconstruct<T>[1][number]>
    }[T extends _Shape<any>
      ? 'shape'
      : T extends _Array<any>
      ? 'array'
      : T extends _Or<any>
      ? 'or'
      : never]
