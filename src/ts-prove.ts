import {
  is,
  isFunction,
  hasKey,
  toString,
  keys,
  isArray,
  isNumber,
  isUndefined,
  isString,
  isBoolean,
  isSymbol,
  isNull,
} from './utils'

/** @internal
 * Aliases
 */
type Error = string
type True = true
type Tuple<A, B> = [A, B]
type Function<A extends any[], B extends any> = (...args: A) => B
type Value = number | string | boolean | symbol | null | undefined | Record<any, any> | any[]

/**
 * Return types
 */
export type Valid = True | Error
export type Success<T> = Tuple<null, T>
export type Failure<T = unknown> = Tuple<Error, T>

/**
 * Compose validation functions
 * @param any the input type for the proof
 * @return (Proof | Success | Faillure)
 */
export interface Proof<R extends Value> {
  <T extends IsValid<R> | R>(x: T, trs?: IsValid<R>[]): T extends IsValid<R>
    ? Proof<R>
    : Failure | Success<R>
}

// Unwrap the internal type of Proof
export type ProofOf<T> = T extends Proof<infer D> ? D : never

// Unwrap the internal type of Proof
export type IsValid<T extends any = unknown> = Function<[T], Valid>

/**
 * Failure Type guard for return value of proof
 * @param { Proof<T> | Success<T> | Failure }
 * @retun @type { boolean }
 */
export const isFailure = is<Failure<any>>((y) => y && isString((y as Success<any>)[0]))

/**
 * Success Type guard for return value of proof
 * @param { Proof<T> | Success<T> | Failure }
 * @retun @type { boolean }
 */
export const isSuccess = is<Success<any>>((y) => !!(y && (y as Success<any> | Failure)[0] === null))

/**
 * Recursing Type guard for return value of proof
 * @param { Proof<T> | Success<T> | Failure }
 * @retun @type { boolean }
 */
export const isProof = <T extends ReturnType<Proof<any>>>(x: T) =>
  is<Proof<any>>((y) => !isArray(y))(x)

// @internal create failure return type
const failure = (err: string, x: unknown): Failure => [err, x]

// @internal create success return type
const success = <T extends any>(x: T): Success<T> => [null, x]

// @internal wrap validation check in return type
const toReturn = <T extends any>(value: T, result: string | true) =>
  isString(result) ? failure(result, value) : success(value)

/**
 * Takes the return type of
 * @param { Value | IsValid<T> } valueOrIsValid a value or callback function
 * @retun
 *  if valueOrIsValid is not a callback function then @type { Failure | Success<T> }
 *  otherwise @type { prove }
 */
export const isValid = <T extends ReturnType<Proof<any>>>(x: T): Valid =>
  isProof(x) ? 'recieved function expected value' : isFailure(x) ? x[0] : true

export const valid = <T extends Proof<any>>(prf: T) => (y: Value) => isValid(prf(y))

/**
 * Takes a value
 * @param { Value | IsValid<T> } valueOrIsValid a value or callback function
 * @retun
 *  if valueOrIsValid is not a callback function then @type { Failure | Success<T> }
 *  otherwise @type { prove }
 */
export const prove = <T extends IsValid<T> | Value>(
  valueOrIsValid: T | IsValid<T>,
  trs: IsValid<T>[] = []
): Proof<T> =>
  is<IsValid<T>>(isFunction)(valueOrIsValid)
    ? (y) => prove(y, [...trs, valueOrIsValid])
    : (trs.reduce<Failure | Success<T>>(
        (a, b) => (isFailure(a) ? a : toReturn(valueOrIsValid, b(valueOrIsValid))),
        [null, valueOrIsValid]
      ) as any)

/**
 * Proof standered library
 */

/**
 * Proof for traversion key value object proofs
 * @param { { [x: string]: Proof<T> } } shp a key value object of proofs
 * @return Success<{ [x: string]: T }> | Failure
 */
const shape = <T extends Record<any, Proof<any>>>(shp: T) =>
  prove<{ [Key in keyof T]: ProofOf<T[Key]> }>((x) =>
    keys(shp).reduce<string | true>((a, b) => {
      if (!hasKey(b)(x)) return toString({ ...(a as any)[1], [b]: '__missing__' })
      const res = shp[b](x[b])
      if (isFailure(res)) return toString({ ...(a as any)[1], [b]: res[0] })
      return a
    }, true)
  )

/**
 * Proof for traversion key value object proofs
 * @param { Proof<T> } arrayOf a key value object of proofs
 * @return Success<[null, T[]]> | Failure
 */
const array = <T extends Proof<any>>(arrayOf: T) =>
  prove<ProofOf<T>[]>((y) =>
    y.reduce<string | true>((a, b, i) => {
      if (isString(a)) return a
      const res = arrayOf(b)
      if (isFailure(res)) return `[ ([${i}] ${res[0]}) ]`
      return a
    }, true)
  )

/**
 * Logical proof which checks that item is one of some type
 * @param { Proof<A> } arrayOf a key value object of proofs
 * @return Success<[null, A> | Failure
 */
const oneOf = <T extends Proof<any>[]>(...proofs: T) =>
  prove<ProofOf<T[number]>>((value) =>
    proofs.reduce<string | true>(
      (a, prf) => (a === true ? a : isFailure(prf(value)) ? a : true) as any,
      'value not match any proofs'
    )
  )

export default {
  string: prove<string>((x) => isString(x) || 'Expected string'),
  number: prove<number>((x) => isNumber(x) || 'Expected number'),
  boolean: prove<boolean>((x) => isBoolean(x) || 'Expected boolean'),
  symbol: prove<symbol>((x) => isSymbol(x) || 'Expected symbol'),
  null: prove<null>((x) => isNull(x) || 'Expected null'),
  undefined: prove<undefined>((x) => isUndefined(x) || 'Expected undefined'),
  shape,
  array,
  oneOf,
}
