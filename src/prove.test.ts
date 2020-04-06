import P from './prove'
import { outputString, success, failure } from './utils'

test('non function value returns success(value)', () => {
  expect(P(10)).toEqual(success(10))
})

test('calback value returns proof', () => {
  expect(typeof P((x) => null)).toEqual('function')
})

test('proof is infinetly recursive', () => {
  const numberBound = P<number>((x) => x > 5 || 'less than 5')((x) => x < 10 || 'greater than 10')

  expect(numberBound(6)).toEqual(success(6))
  expect(numberBound(11)).toEqual(failure('greater than 10', 11))
  expect(numberBound(4)).toEqual(failure('less than 5', 4))
})

test('primitive proofs', () => {
  const fail = (type: string, input: any) => failure(`Expected ${type}`, input)

  expect(P.number(10)).toEqual(success(10))
  expect(P.number('foo' as any)).toEqual(fail('number', 'foo'))

  expect(P.string('foo')).toEqual(success('foo'))
  expect(P.string(10 as any)).toEqual(fail('string', 10))

  expect(P.boolean(false)).toEqual(success(false))
  expect(P.boolean(true)).toEqual(success(true))
  expect(P.boolean(10 as any)).toEqual(fail('boolean', 10))

  let symbol = Symbol()
  expect(P.symbol(symbol)).toEqual(success(symbol))
  expect(P.symbol(10 as any)).toEqual(fail('symbol', 10))

  expect(P.null(null)).toEqual(success(null))
  expect(P.null(10 as any)).toEqual(fail('null', 10))

  expect(P.undefined(undefined)).toEqual(success(undefined))
  expect(P.undefined(10 as any)).toEqual(fail('undefined', 10))
})

test('shape with optional prop', () => {
  expect(P.shape({ one: P.string, two: P.optional(P.number) })({} as any)).toEqual(
    failure(outputString({ one: 'Expected string' }), {})
  )
  expect(P.shape({ one: P.string, two: P.optional(P.number) })({ one: 'okay' } as any)).toEqual(
    success({ one: 'okay' })
  )
  expect(
    P.shape({ one: P.string, two: P.optional(P.number) })({ one: 'one', two: 'three' } as any)
  ).toEqual(failure(outputString({ two: 'Expected number' }), { one: 'one', two: 'three' }))
  expect(P.shape({ one: P.string, two: P.optional(P.number) })({ one: 'one', two: 10 })).toEqual(
    success({ one: 'one', two: 10 })
  )
})

test('shape handles missing key', () => {
  expect(P.shape({ one: P.string })({} as any)).toEqual(
    failure(outputString({ one: 'Expected string' }), {})
  )
})

test('shape accepts key value object of proofs and returns first error', () => {
  const fail = (error: any, input: any) => failure(outputString(error), input)

  const proof = P.shape({ one: P.string, two: P.number })
  expect(proof({ one: 'one', two: 10 })).toEqual(success({ one: 'one', two: 10 }))
  expect(proof({ one: 'one', two: '10' as any })).toEqual(
    fail({ two: 'Expected number' }, { one: 'one', two: '10' })
  )
})

test('array validates all items in array', () => {
  expect(P.array(P.string)(['foo', 'bar'])).toEqual(success(['foo', 'bar']))
  expect(P.array(P.string)(['foo', 'bar', 12 as any])).toEqual(
    failure('[ ([2] Expected string) ]', ['foo', 'bar', 12])
  )
})

test('array should return only first error', () => {
  expect(P.array(P.string)(['foo', 'bar', 12 as any, 13 as any])).toEqual(
    failure('[ ([2] Expected string) ]', ['foo', 'bar', 12, 13])
  )
})

test('array should first check for array type', () => {
  expect(P.array(P.string)({ one: 'foo' } as any)).toEqual(
    failure('Expected array', { one: 'foo' })
  )
})

test('or should pass if value is one of', () => {
  expect(P.or(P.string, P.boolean)('foo')).toEqual(success('foo'))
  expect(P.or(P.string, P.boolean)(true)).toEqual(success(true))
  expect(P.or(P.string, P.boolean)(10 as any)).toEqual(failure('Expected string or boolean', 10))
})

test('strict equality', () => {
  expect(P.equals('foo')('foo')).toEqual(success('foo'))
  expect(P.equals({})({})).toEqual(failure('{} is not equal to {}', {}))
})
