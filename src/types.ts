export type Error = string
export type True = true
export type Tuple<A, B> = [A, B]
export type Function<A extends any[], B extends any> = (...args: A) => B
export type Value = number | string | boolean | symbol | null | undefined | Record<any, any> | any[]

/**
 * Return types
 */
export type Valid = True | Error
export type Success<T> = Tuple<null, T>
export type Failure<T = unknown> = Tuple<string, T>

/**
 * Compose validation functions
 * @param any the input type for the proof
 * @return (Proof | Success | Faillure)
 */
export interface Proof<R extends Value> {
  <T extends Check<R> | R>(x: T, trs?: Check<R>[]): T extends Check<R>
    ? Proof<R>
    : Failure | Success<R>
}

// Unwrap the internal type of Proof
export type TypeOfProof<T extends Proof<any>> = T extends Proof<infer D> ? D : never

// Unwrap the internal type of Proof
export type Check<T extends any = unknown> = Function<[T], Valid>
