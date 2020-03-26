export const toString = (val: unknown): string =>
  guard.string(val)
    ? val
    : guard.shape(val)
    ? JSON.stringify(val, null, 2).replace(/(')|(")/gi, '')
    : guard.array(val)
    ? `[ ${val && val.map(toString).join(', ')} ]`
    : guard.null(val)
    ? 'null'
    : guard.undefined(val)
    ? 'undefined'
    : (val as any).toString()

const is = <T>(fn: (x: unknown) => boolean) => (value: unknown): value is T => fn(value)
const isFunction = is<Function>((value) => typeof value === 'function')
const isArray = is<unknown[]>(Array.isArray)

type Prim = string | number | symbol | boolean | null | undefined
const equal = (a: Prim, b: Prim) => a === b

export const guard = {
  null: is<null>((value) => value === null),
  undefined: is<undefined>((value) => value === undefined),
  boolean: is<boolean>((value) => value === true || value === false),
  string: is<string>((value) => typeof value === 'string'),
  number: is<number>((value) => typeof value === 'number'),
  function: isFunction,
  array: isArray,
  shape: is<Record<string, any>>(
    (value) => typeof value === 'object' && !isFunction(value) && !isArray(value) && value !== null
  ),
  equal: <T extends Prim>(a: T, b: T): a is T => a === b,
  hasKey: <K extends keyof Record<any, any>>(key: K, x: unknown) =>
    is<{ [Key in K]: any }>((x) => !!(x && (x as any)[key]))(x),
}
