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

test('String validation', () => {
  expect(_string()('')).toEqual([null, ''])
  expect(_string()(10)).toEqual(['Unexpected 10', 10])
})

test('Number validation', () => {
  expect(_number()(10)).toEqual([null, 10])
  expect(_number()('10')).toEqual(['Unexpected 10', '10'])
})

test('Constant validation', () => {
  expect(_constant('foo')('foo')).toEqual([null, 'foo'])
  expect(_constant('foo')('bar')).toEqual(['foo is not equal to bar', 'foo'])
})

test('Others validation', () => {
  expect(_null()(null)).toEqual([null, null])
  expect(_null()(undefined)).toEqual(['Unexpected undefined', undefined])

  expect(_undefined()(undefined)).toEqual([null, undefined])
  expect(_undefined()(null)).toEqual(['Unexpected null', null])

  expect(_any()({ one: '100' })).toEqual([null, { one: '100' }])
  expect(_unknown()({ one: '100' })).toEqual([null, { one: '100' }])
})
