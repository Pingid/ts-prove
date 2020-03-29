export const compose = <A extends any, B extends any, C extends any>(
  fn2: (x: B) => C,
  fn1: (x: A) => B
) => (x: A) => fn2(fn1(x))

// @internal generic type guard
export const is = <T>(fn: <T extends unknown = any>(x: T) => boolean) => (
  value: unknown
): value is T => fn(value)

/**
 * Generic type guards
 */
export const isString = is<string>((value) => typeof value === 'string')
export const isNumber = is<number>((value) => typeof value === 'number')
export const isBoolean = is<boolean>((value) => value === true || value === false)
export const isSymbol = is<symbol>((value) => typeof value === 'symbol')
export const isFunction = is<Function>((value) => typeof value === 'function')
export const isUndefined = is<undefined>((y) => y === undefined)
export const isNull = is<null>((y) => y === null)
export const isArray = is<unknown[]>(Array.isArray)
export const isShape = is<Record<string, any>>(
  (value) => typeof value === 'object' && !isFunction(value) && !isArray(value) && value !== null
)
export const hasKey = <K extends keyof Record<any, any>>(k: K) =>
  is<Record<K, any>>((y) => !!(y && !isUndefined((y as Record<any, any>)[k])))

// @internal Return readable string output for any type
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

// @internal Convert object to formatted string
export const errorJ = <T extends Record<string, string> | any[]>(x: T) =>
  JSON.stringify(
    isArray(x) ? x.map((x, i) => `[${i}] ${toString(x)}`) : x,
    (_key, value) => (isString(value) ? value.replace(/\n/gim, `\n  `) : value),
    2
  )
    .replace(/"/gim, '')
    .replace(/\\n/gim, `\n`)

// @internal typed wrapper for Object.keys
export const keys = <T extends Record<any, any>>(x: T) => Object.keys(x) as (keyof T)[]
