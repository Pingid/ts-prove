import './types'
import './utils'
import {
  _string,
  _number,
  _null,
  _undefined,
  _any,
  _unknown,
  _or,
  _array,
  _shape,
} from './validators'

export default {
  string: _string,
  number: _number,

  null: _null,
  undefined: _undefined,

  any: _any,
  unknown: _unknown,

  or: _or,
  array: _array,
  shape: _shape,

  s: _string,
  n: _number,
  o: _shape,
  a: _array,
}
