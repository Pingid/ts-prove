type _Error<T extends any> = [string, T]
type _Success<T extends any> = [null, T]

export type _Construct<P extends any, U extends any = unknown> = <T>(
  x: unknown,
  depth?: number
) => _Error<U> | _Success<P>

export type _Deconstruct<T extends _V> = T extends _Construct<infer A> ? A : never

export type _Infer<T extends any> = _Construct<T>

export type _String = _Construct<string>
export type _Number = _Construct<number>
export type _Null = _Construct<null>
export type _Undefined = _Construct<undefined>

export type _Or<T extends _V[]> = _Construct<_Deconstruct<T[number]>>
export type _Array<T extends _V> = _Construct<_Deconstruct<T>[], unknown[]>
export type _Shape<T extends { [x: string]: _V }> = _Construct<
  { [Key in keyof T]: _Deconstruct<T[Key]> }
>

export type _Prim = _Number | _String | _Null | _Undefined
export type _V = _Prim | _Array<any> | _Shape<any> | _Or<any> | _Infer<any>
