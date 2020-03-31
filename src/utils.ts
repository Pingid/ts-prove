import { Proof, Failure, Success, Value, Valid } from './types'

/**
 * Type guard utility with guards set for primitives
 */
export const is = <T>(fn: (x: unknown) => boolean) => (value: any): value is T => fn(value)

is.null = is<null>((y) => y === null)
is.array = is<unknown[]>(Array.isArray)
is.string = is<string>((value) => typeof value === 'string')
is.number = is<number>((value) => typeof value === 'number')
is.symbol = is<symbol>((value) => typeof value === 'symbol')
is.boolean = is<boolean>((value) => value === true || value === false)
is.function = is<Function>((value) => typeof value === 'function')
is.undefined = is<undefined>((y) => y === undefined)
is.object = is<Record<string, any>>(
  (value) => typeof value === 'object' && !is.function(value) && !is.array(value) && value !== null
)

/**
 * Proof utilities
 */
export const failure = (err: string, x: unknown): Failure => [err, x]
export const isFailure = is<Failure<any>>((y) => y && is.string((y as Success<any>)[0]))

export const success = <T extends any>(x: T): Success<T> => [null, x]
export const isSuccess = is<Success<any>>((y) => !!(y && (y as Success<any> | Failure)[0] === null))

export const result = <T extends any>(value: T, result: Valid) =>
  result !== true ? failure(result, value) : success(value)

export const valid = <T extends Proof<any>>(prf: T) => (y: Value) => {
  if (is.function(y))
    throw new Error(`recieved callback {${y.toString()}} expected none function value`)
  return prf(y)[0] || true
}

/**
 * Generate output string for all javascript types
 */
export const outputString = (val: any): string => {
  if (is.undefined(val)) return 'undefined'
  if (is.null(val)) return 'null'
  if (is.object(val))
    return JSON.stringify(
      val,
      (_key, value) => (is.string(value) ? value.replace(/\n/gim, `\n  `) : value),
      2
    )
      .replace(/"/gim, '')
      .replace(/\\n/gim, `\n`)
  return val.toString()
}
