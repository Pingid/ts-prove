import { _V, _Eval } from './types'
import {
  _string,
  _number,
  _null,
  _undefined,
  _any,
  _unknown,
  _or,
  _constant,
  _array,
  _shape
} from './validators'

export const validate = <T extends _V>(a: T) => (b: any) => {
  const error = a.validate(b)
  if (error === true) return { value: b as _Eval<T> }
  return { error }
}

export default {
  string: _string,
  number: _number,

  null: _null,
  undefined: _undefined,

  any: _any,
  unknown: _unknown,
  constant: _constant,

  or: _or,
  array: _array,
  shape: _shape,

  s: _string,
  n: _number,
  o: _shape,
  a: _array
}
