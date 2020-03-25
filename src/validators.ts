import { guard, toString } from './utils'
import {
  TV,
  _V,
  _String,
  _Number,
  _Null,
  _Undefined,
  _Any,
  _Unknown,
  _Or,
  _Constant,
  _Array,
  _Shape
} from './types'

const ofType = <T extends _V>(type: T['type'], validate: T['validate']) => () =>
  ({ type, validate } as T)

export const _string = ofType<_String>(
  TV.STRING,
  x => guard.string(x) || `Unexpected ${toString(x)}`
)
export const _number = ofType<_Number>(
  TV.NUMBER,
  x => guard.number(x) || `Unexpected ${toString(x)}`
)
export const _null = ofType<_Null>(TV.NULL, x => guard.null(x) || `Unexpected ${toString(x)}`)
export const _undefined = ofType<_Undefined>(
  TV.UNDEFINED,
  x => guard.undefined(x) || `Unexpected ${toString(x)}`
)
export const _any = ofType<_Any>(TV.ANY, () => true)
export const _unknown = ofType<_Unknown>(TV.UNKNOWN, () => true)
export const _or = <T extends _V[]>(x: T) =>
  ofType<_Or<T>>(TV.OR, y => {
    const pass = x.reduce<string | boolean>((a, b) => a === true || b.validate(y as any), false)
    return pass === true || `Nothing matched ${toString(y)}`
  })()

export const _constant = <T extends string>(x: T) =>
  ofType<_Constant<T>>(TV.CONSTANT, v => v === x || `${x} is not equal to ${toString(v)}`)()

export const _array = <T extends _V>(x: T) =>
  ofType<_Array<T>>(TV.ARRAY, (y: unknown) =>
    guard.array(y)
      ? (y.reduce<string | boolean>((a, b, i) => {
          const res = (x as any).validate(b)
          if (guard.string(res)) {
            return guard.string(a)
              ? a
              : '[' + ` ([${i}] ${res}), ` + (i === y.length - 1 ? ']' : '')
          }
          return true
        }, true) as string | true)
      : `Expected type array ${toString(y)}`
  )()

export const _shape = <T extends { [x: string]: _V }>(x: T) =>
  ofType<_Shape<T>>(TV.SHAPE, (y: unknown, depth = 0) => {
    const errors = Object.keys(x).reduce((all, key) => {
      if (!guard.hasKey(key, y)) {
        return all + '\n' + `${'\t'.repeat(depth + 1)}[${key}] is not defined`
      }
      const res = x[key].validate((y as Record<typeof key, any>)[key], depth + 1)
      if (!guard.string(res) || res.length < 4) return all
      return all + '\n' + `${'\t'.repeat(depth + 1)}${key}: ${res}`
    }, '{')
    if (guard.string(errors) && errors.length > 4) return errors + `\n${'\t'.repeat(depth)}}`
    return true
  })()
