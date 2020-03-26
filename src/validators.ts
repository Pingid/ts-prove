import { guard, toString } from './utils'
import {
  _V,
  _String,
  _Number,
  _Null,
  _Undefined,
  _Or,
  _Array,
  _Shape,
  _Deconstruct,
  _Infer,
  _Construct,
} from './types'

export const _string = (): _String => (x) =>
  guard.string(x) ? [null, x] : [`Unexpected ${toString(x)}`, x]

export const _number = (): _Number => (x) =>
  guard.number(x) ? [null, x] : [`Unexpected ${toString(x)}`, x]

export const _null = (): _Null => (x) =>
  guard.null(x) ? [null, x] : [`Unexpected ${toString(x)}`, x]

export const _undefined = (): _Undefined => (x) =>
  guard.undefined(x) ? [null, x] : [`Unexpected ${toString(x)}`, x]

export const _equal = <T extends any = any>(): _Infer<T> => (x) => [null, x as T]
export const _any = <T extends any = any>(): _Infer<T> => (x) => [null, x as T]
export const _unknown = <T extends any = unknown>(): _Infer<T> => (x) => [null, x as T]

export const _or = <T extends _V[]>(x: T): _Or<T> => (y) => {
  const pass = x.reduce((a, b) => a === true || !(b as any)(y as any)[0], false)
  return pass === true ? [null, y as any] : [`Nothing matched ${toString(y)}`, y]
}

export const _constant = <T extends string>(x: T): _Infer<T> => (v) =>
  v === x ? [null, x] : [`${x} is not equal to ${toString(v)}`, x]

export const _array = <T extends _V>(x: T): _Array<T> => (y) =>
  guard.array(y)
    ? y.reduce<[string | null, any]>(
        (a, b, i) => {
          const res = (x as any)(b)
          return [
            guard.string(res[0])
              ? (guard.string(a[0]) ? '' : '[') + ` ([${i}] ${res[0]}), `
              : res[0],
            [...a[1], b],
          ]
        },
        [null, []]
      )
    : [`Expected type array ${toString(y)}`, y]

export const _shape = <T extends { [x: string]: _V }>(shpe: T): _Shape<T> => (y, depth = 0) => {
  const errors = (Object.keys(shpe) as (keyof T)[]).reduce((all, key) => {
    if (!guard.hasKey(key, y)) {
      return all + '\n' + `${'\t'.repeat(depth + 1)}[${key}] is not defined`
    }
    const res = (shpe as any)[key]((y as Record<typeof key, any>)[key], depth + 1)
    if (!guard.string(res[0]) || res[0].length < 4) return all
    return all + '\n' + `${'\t'.repeat(depth + 1)}${key}: ${res}`
  }, '{')
  if (guard.string(errors) && errors.length > 4) return [errors + `\n${'\t'.repeat(depth)}}`, y]
  return [null, y as { [Key in keyof T]: _Deconstruct<T[Key]> }]
}
