export { default as P } from './types'
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
  _shape,
} from './validators'
import { guard } from './utils'

export const isError = <T>(x: [string, unknown] | [null, T]): x is [null, T] => guard.null(x[0])

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
  a: _array,
}
