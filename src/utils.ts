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
 * Generate output string for all types
 */
export const outputString = (val: any): string => {
  if (is.undefined(val)) return 'undefined'
  if (is.null(val)) return 'null'
  if (is.array(val))
    return val.reduce<string>((a, b, i) => `${a}, ( [${i}]: ${outputString(b)} )`, '')
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
