type Error<T extends any> = [string, T]
type Success<T extends any> = [null, T]

export type ProveT<P extends any, U extends any = unknown> = <T>(
  x: unknown,
  depth?: number
) => Error<U> | Success<P>

export type InferProof<T extends P.Type> = T extends ProveT<infer A> ? A : never

namespace P {
  export type Infer<T extends any> = ProveT<T>
  export type String = ProveT<string>
  export type Number = ProveT<number>
  export type Null = ProveT<null>
  export type Undefined = ProveT<undefined>
  export type Or<T extends Type[]> = ProveT<InferProof<T[number]>>
  export type Array<T extends Type> = ProveT<InferProof<T>[], unknown[]>
  export type Shape<T extends { [x: string]: Type }> = ProveT<
    { [Key in keyof T]: InferProof<T[Key]> }
  >
  export type Primitive = Number | String | Null | Undefined
  export type Type = Primitive | Array<any> | Shape<any> | Or<any> | Infer<any>
}

export default P
