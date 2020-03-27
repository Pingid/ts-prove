export type Failure<T extends any> = [string, T]
export type Success<T extends any> = [null, T]

export type Validator<P extends any, U extends any = any> = (
  x: U,
  depth?: number
) => Failure<U> | Success<P>

export type ValidType<T extends Proof> = T extends Validator<infer A> ? A : never

export namespace P {
  export type Infer<T extends any> = Validator<T>
  export type String = Validator<string>
  export type Number = Validator<number>
  export type Boolean = Validator<boolean>
  export type Symbol = Validator<symbol>
  export type Null = Validator<null>
  export type Undefined = Validator<undefined>
  export type Or<T extends Proof[]> = Validator<ValidType<T[number]>>
  export type Array<T extends Proof> = Validator<ValidType<T>[]>
  export type Shape<T extends { [x: string]: Proof }> = Validator<
    { [Key in keyof T]: ValidType<T[Key]> }
  >
}

export type Primitive = P.Number | P.String | P.Null | P.Undefined
export type Proof = Primitive | P.Array<any> | P.Shape<any> | P.Or<any> | P.Infer<any>
