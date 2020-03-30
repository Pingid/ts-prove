import { Check, Value, Proof, TypeOfProof, Failure, Success, Valid } from './types'
import { is, outputString } from './utils'

export const isProof = <T extends ReturnType<Proof<any>>>(x: T) =>
  is<Proof<any>>((y) => !is.array(y))(x)

export const failure = (err: string, x: unknown): Failure => [err, x]
export const isFailure = is<Failure<any>>((y) => y && is.string((y as Success<any>)[0]))

export const success = <T extends any>(x: T): Success<T> => [null, x]
export const isSuccess = is<Success<any>>((y) => !!(y && (y as Success<any> | Failure)[0] === null))

export const valid = <T extends Proof<any>>(prf: T) => (y: Value) => isValid(prf(y))
export const isValid = <T extends ReturnType<Proof<any>>>(x: T): Valid =>
  isProof(x) ? 'recieved function expected value' : isFailure(x) ? x[0] : true

const toReturn = <T extends any>(value: T, result: Valid) =>
  is.string(result) ? failure(result, value) : success(value)

/**
 * Where the magic happens
 */
const prove = <T extends Check<T> | Value>(
  valueOrCheck: T | Check<T>,
  trs: Check<T>[] = []
): Proof<T> =>
  is<Check<T>>(is.function)(valueOrCheck)
    ? (y) => prove(y, [...trs, valueOrCheck])
    : (trs.reduce<Failure | Success<T>>(
        (a, b) => (isFailure(a) ? a : toReturn(valueOrCheck, b(valueOrCheck))),
        [null, valueOrCheck]
      ) as any)

/**
 * Proof for javasript primitives
 */
prove.string = prove<string>((x) => is.string(x) || 'Expected string')
prove.number = prove<number>((x) => is.number(x) || 'Expected number')
prove.boolean = prove<boolean>((x) => is.boolean(x) || 'Expected boolean')
prove.symbol = prove<symbol>((x) => is.symbol(x) || 'Expected symbol')
prove.null = prove<null>((x) => is.null(x) || 'Expected null')
prove.undefined = prove<undefined>((x) => is.undefined(x) || 'Expected undefined')

/**
 * Structured key value Proof
 */
prove.shape = <T extends Record<any, Proof<any>>>(shp: T) =>
  prove<{ [Key in keyof T]: TypeOfProof<T[Key]> }>((x) =>
    Object.keys(shp).reduce<Valid>((a, b) => {
      if (!x[b]) return outputString({ ...(a as any)[1], [b]: '__missing__' })
      const res = shp[b](x[b])
      if (isFailure(res)) return outputString({ ...(a as any)[1], [b]: res[0] })
      return a
    }, true)
  )

/**
 * Structured array Proof
 */
prove.array = <T extends Proof<any>>(arrayOf: T) =>
  prove<TypeOfProof<T>[]>((y) =>
    y.reduce<Valid>((a, b, i) => {
      if (is.string(a)) return a
      const res = arrayOf(b)
      if (isFailure(res)) return `[ ([${i}] ${res[0]}) ]`
      return a
    }, true)
  )

/**
 * Logical proof which checks that item is one of some type
 */
prove.or = <T extends Proof<any>[]>(...proofs: T) =>
  prove<TypeOfProof<T[number]>>((value) =>
    proofs.reduce<Valid>(
      (a, prf) => (a === true ? a : isFailure(prf(value)) ? a : true) as any,
      'value not match any proofs'
    )
  )

export default prove
