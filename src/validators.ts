import { P, Proof, Success, Failure, ValidType } from './types'
import {
  toString,
  hasKey,
  isString,
  isNumber,
  isNull,
  isUndefined,
  isBoolean,
  isSymbol,
  isArray,
  isError,
  errorT,
  errorJ,
} from './utils'

/** @internal
 * Validator result wrapper
 */
const result = <T>(x: boolean, err: string, res: T) =>
  x ? ([null, res] as Success<T>) : ([err, res] as Failure<unknown>)

/**
 * TS Prove validators
 */
export const _string = (): P.String => (x) => result(isString(x), errorT('string', x), x)
export const _number = (): P.Number => (x) => result(isNumber(x), errorT('number', x), x)
export const _boolean = (): P.Boolean => (x) => result(isBoolean(x), errorT('boolean', x), x)
export const _symbol = (): P.Symbol => (x) => result(isSymbol(x), errorT('symbol', x), x)

export const _null = (): P.Null => (x) => result(isNull(x), errorT('null', x), x)
export const _undefined = (): P.Undefined => (x) =>
  result(isUndefined(x), errorT('undefined', x), x)

export const _any = <T extends any = any>(): P.Infer<T> => (x) => result(true, '', x as T)
export const _unknown = <T extends unknown = unknown>(): P.Infer<T> => (x) =>
  result(true, '', x as T)

export const _equal = <T extends string>(x: T): P.Infer<T> => (v) =>
  result(v === x, `${x} is not equal to ${toString(v)}`, x)

export const _or = <T extends Proof[]>(x: T): P.Or<T> => (y) =>
  result(
    x.reduce((a, b) => a === true || !b(y)[0], false) === true,
    `Nothing matched ${toString(y)}`,
    y
  )

export const _array = <T extends Proof>(x: T): P.Array<T> => (y) => {
  if (!isArray(y)) return [errorT('array', y), y]
  const result = y.reduce<string[]>((a, b) => (isError(x(b)) ? [...a, x(b)[0] as string] : a), [])
  if (result.length > 0) return [errorJ(result), y]
  return [null, y as ValidType<T>]
}

export const _shape = <T extends { [x: string]: Proof }>(shpe: T): P.Shape<T> => (y, depth = 0) => {
  const result = Object.keys(shpe).reduce<[boolean, Record<any, any>]>(
    (all, key) => {
      if (!hasKey(key, y)) return [true, { ...all[1], [key]: '__missing__' }]
      const res = shpe[key](y[key], depth + 1)
      if (isError(res)) return [true, { ...all[1], [key]: res[0] }]
      return all
    },
    [false, {}]
  )

  if (result[0]) return [errorJ(result[1]), y]
  return [null, y]
}
