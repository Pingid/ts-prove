import { Failure } from './types'

/**
 * Curried wrappers for building type guards
 */
export const is = <T>(fn: (x: unknown) => boolean) => (value: unknown): value is T => fn(value)
export const isEq = <T>(x: T) => is<T>((y) => y === x)

/**
 * Generic type guards
 */
export const isString = is<string>((value) => typeof value === 'string')
export const isNumber = is<number>((value) => typeof value === 'number')
export const isBoolean = is<boolean>((value) => value === true || value === false)
export const isSymbol = is<symbol>((value) => typeof value === 'symbol')
export const isFunction = is<Function>((value) => typeof value === 'function')
export const isArray = is<unknown[]>(Array.isArray)
export const isShape = is<Record<string, any>>(
  (value) => typeof value === 'object' && !isFunction(value) && !isArray(value) && value !== null
)

export const isNull = isEq(null)
export const isUndefined = isEq(undefined)

export const hasKey = <K extends keyof Record<any, any>>(k: K, x: unknown): x is Record<K, any> =>
  x && !isUndefined((x as Record<any, any>)[k])

/** @internal
 * Returns a string value for any type
 */
export const toString = (val: unknown): string =>
  isString(val)
    ? val
    : isShape(val) || isArray(val)
    ? errorJ(val)
    : isNull(val)
    ? 'null'
    : isUndefined(val)
    ? 'undefined'
    : (val as any).toString()

export const errorT = (expected: string, received: any) =>
  `Expected ${expected} Recieved ${toString(received)}`

export const errorJ = <T extends Record<string, string> | any[]>(x: T) =>
  JSON.stringify(
    isArray(x) ? x.map((x, i) => `[${i}] ${toString(x)}`) : x,
    (_key, value) => (isString(value) ? value.replace(/\n/gim, `\n  `) : value),
    2
  )
    .replace(/"/gim, '')
    .replace(/\\n/gim, `\n`)

/**
 * TS Prove type guards
 */
export const isError = is<Failure<unknown>>((x) => isString(x && (x as any[])[0]))
