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
} from '../src/validators'

test('String validation', () => {
  expect(_string().validate('')).toBe(true)
  expect(_string().validate(10)).toBe('Unexpected 10')
})

test('Number validation', () => {
  expect(_number().validate(10)).toBe(true)
  expect(_number().validate('')).toBe('Unexpected ')
})

test('Null validation', () => {
  expect(_null().validate(null)).toBe(true)
  expect(_null().validate(10)).toBe('Unexpected 10')
})

test('Undefined validation', () => {
  expect(_undefined().validate(undefined)).toBe(true)
  expect(_undefined().validate(10)).toBe('Unexpected 10')
})

test('Any or unknown validation', () => {
  expect(_any().validate({ one: 'foobar' })).toBe(true)
  expect(_any().validate(10)).toBe(true)
  expect(_unknown().validate({ one: 'foobar' })).toBe(true)
  expect(_unknown().validate(10)).toBe(true)
})

test('Constant validation', () => {
  expect(_constant('CONSTANT').validate('CONSTANT')).toBe(true)
  expect(_constant('CONSTANT').validate('10')).toBe('CONSTANT is not equal to 10')
})

test('Or validation', () => {
  expect(_or([_constant('CONSTANT'), _number()]).validate('CONSTANT')).toBe(true)
  expect(_or([_constant('CONSTANT'), _number()]).validate(10)).toBe(true)
  expect(_or([_constant('CONSTANT'), _number()]).validate('10')).toBe('Nothing matched 10')
})

test('array validation', () => {
  expect(_array(_string()).validate(['dsf', 'dfs', '10'])).toEqual(true)
  expect(_array(_array(_string())).validate([['dsf', 'dfs'], ['10']])).toEqual(true)
  expect(_array(_string()).validate(['dsf', 'dfs', 10])).toEqual('[ ([2] Unexpected 10), ]')
})

test('shape validation', () => {
  expect(_shape({ one: _string() }).validate({ one: 'one' }))
  const res = _shape({ one: _string(), two: _shape({ three: _string() }) }).validate({
    one: 'one',
    two: { three: 's' }
  })
  expect(res).toBe(true)
  expect(
    _shape({ one: _string(), two: _shape({ three: _string() }) }).validate({
      one: 'one',
      two: { three: 10 }
    })
  ).toBe('{\n\ttwo: {\n\t\tthree: Unexpected 10\n\t}\n}')
})
