/**
 * Validators
 */
export namespace P {
  export type String = Wrap<string>
  export type Number = Wrap<number>
  export type Boolean = Wrap<boolean>
  export type Symbol = Wrap<symbol>
  export type Null = Wrap<null>
  export type Undefined = Wrap<undefined>

  export type Infer<T extends any> = Wrap<T>
  export type Or<T extends Proof[]> = Wrap<Unwrap<T[number]>>
  export type Array<T extends Proof> = Wrap<Unwrap<T>[]>
  export type Shape<T extends { [x: string]: Proof }> = Wrap<{ [Key in keyof T]: Unwrap<T[Key]> }>
}

/**
 * Validator unions
 */
export type Proof =
  | P.Number
  | P.String
  | P.Symbol
  | P.Boolean
  | P.Null
  | P.Undefined
  | P.Array<any>
  | P.Shape<any>
  | P.Or<any>
  | P.Infer<any>

/**
 * Return types
 */
export type Failure<T extends any> = [string, T]
export type Success<T extends any> = [null, T]
export type Proven<T extends any> = Success<T> | Failure<unknown>

// @internal
export type Wrap<P extends any, U extends any = any> = (x: U) => Failure<U> | Success<P>
// @internal
export type Unwrap<T extends Proof> = T extends Wrap<infer A> ? A : never
