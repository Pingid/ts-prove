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
  _boolean,
  _symbol,
  _constant,
  result,
} from './validators'
import { errorT, errorJ } from './utils'

test('Result util', () => {
  expect(result(false, 'err', null)).toEqual(['err', null])
  expect(result(true, 'err', null)).toEqual([null, null])
})

test('String validation', () => {
  expect(_string()('')).toEqual([null, ''])
  expect(_string()(10)).toEqual([errorT('string', 10), 10])
})

test('Number validation', () => {
  expect(_number()(10)).toEqual([null, 10])
  expect(_number()('10')).toEqual([errorT('number', '10'), '10'])
})

test('Symbol validation', () => {
  const n = Symbol()
  expect(_symbol()(n)).toEqual([null, n])
  expect(_symbol()('10')).toEqual([errorT('symbol', '10'), '10'])
})

test('Boolean validation', () => {
  expect(_boolean()(true)).toEqual([null, true])
  expect(_boolean()(false)).toEqual([null, false])
  expect(_boolean()('10')).toEqual([errorT('boolean', '10'), '10'])
})

test('Equals validation', () => {
  expect(_constant('A')('A')).toEqual([null, 'A'])
  expect(_constant('A')('B')).toEqual(['A is not equal to B', 'B'])

  expect(_null()(null)).toEqual([null, null])
  expect(_null()(undefined)).toEqual([errorT('null', 'undefined'), undefined])

  expect(_undefined()(undefined)).toEqual([null, undefined])
  expect(_undefined()(null)).toEqual([errorT('undefined', null), null])
})

test('Any validation', () => {
  expect(_any()({ one: '100' })).toEqual([null, { one: '100' }])
  expect(_unknown()({ one: '100' })).toEqual([null, { one: '100' }])
})

test('Or validating', () => {
  expect(_or([_string(), _number()])('one')).toEqual([null, 'one'])
  expect(_or([_string(), _number()])(false)).toEqual(['Nothing matched false', false])
})

test('Array validation', () => {
  expect(_array(_string())(10)).toEqual([errorT('array', 10), 10])
  expect(_array(_string())(['foo', 'bar'])).toEqual([null, ['foo', 'bar']])
  expect(_array(_string())([10, 11])).toEqual([
    errorJ([errorT('string', 10), errorT('string', 11)]),
    [10, 11],
  ])
})

test('Shape validation', () => {
  expect(_shape({ one: _number() })({ one: 10 })).toEqual([null, { one: 10 }])
  expect(_shape({ one: _number() })({ one: 'foobar' })).toEqual([
    errorJ({ one: errorT('number', 'foobar') }),
    { one: 'foobar' },
  ])
})
