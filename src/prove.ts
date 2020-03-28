import { isString, isBoolean, isSymbol, isNull } from 'util'
import { is, isFunction, hasKey, toString, keys, isArray, isNumber, isUndefined } from './utils'
import { Failure, Success } from './types'

export type IsValid<T extends any = unknown> = (x: T) => true | string

export type ProofOf<T> = T extends Proof<infer D> ? D : never
export type Proof<R extends any> = {
  <T extends IsValid<R> | R>(x: T): T extends IsValid<R> ? Proof<R> : Failure<unknown> | Success<R>
}
export type ProoResult<R extends any> = Proof<R> | Failure<unknown> | Success<R>

export const isProof = <T extends ProoResult<any>>(x: T) => is<Proof<any>>((y) => !isArray(y))(x)
export const isFailure = is<Failure<any>>((y) => y && isString((y as Success<any>)[0]))
export const isSuccess = is<Success<any>>((y) => y && (y as Success<any>)[0] === null)

export const prove = <T extends any>(x: T | IsValid<T>, trs: IsValid<T>[] = []): Proof<T> =>
  is<IsValid<T>>(isFunction)(x)
    ? (y) => prove<T>(y, [...trs, x])
    : (trs.reduce<Failure<unknown> | Success<T>>(
        (a, b) => {
          const res = b(x)
          if (isFailure(a) || res === true) return a
          return [res, a[1]]
        },
        [null, x] as Success<T>
      ) as any)

const shape = <T extends Record<any, Proof<any>>>(y: T) =>
  prove<{ [Key in keyof T]: ProofOf<T[Key]> }>((x) =>
    keys(y).reduce<string | true>((a, b) => {
      if (isString(a)) return a
      if (!hasKey(b, x)) return toString({ ...(a as any)[1], [b]: '__missing__' })
      const res = y[b](x[b])
      if (isFailure(res)) return toString({ ...(a as any)[1], [b]: res[0] })
      return a
    }, true)
  )

const array = <T extends Proof<any>>(x: T) =>
  prove<ProofOf<T>[]>((y) =>
    y.reduce<string | true>((a, b, i) => {
      if (isString(a)) return a
      const res = x(b)
      if (isFailure(res)) return `([${i}] ${res[0]})`
      return a
    }, true)
  )

export const proofs = {
  string: prove<string>((x) => isString(x) || 'Expected string'),
  number: prove<number>((x) => isNumber(x) || 'Expected number'),
  boolean: prove<boolean>((x) => isBoolean(x) || 'Expected boolean'),
  symbol: prove<symbol>((x) => isSymbol(x) || 'Expected symbol'),
  null: prove<null>((x) => isNull(x) || 'Expected null'),
  undefined: prove<undefined>((x) => isUndefined(x) || 'Expected undefined'),
  shape,
  array,
}
