import prove, { isFailure, valid, failure, success } from './ts-prove'
import { is, outputString } from './utils'

const p = prove

type Equals<A extends any, B extends A> = A extends B ? 'pass' : never
type Test<T extends 'pass'> = true

test('prove accepts value', () => {
  const result = prove(10)
  expect(result).toEqual(success(10))
})

test('prove accepts arbitrary number of validation callbacks', () => {
  const numberBound = prove<number>((x) => x > 5 || 'less than 5')(
    (x) => x < 10 || 'greater than 10'
  )

  expect(numberBound(6)).toEqual(success(6))
  expect(numberBound(11)).toEqual(failure('greater than 10', 11))
  expect(numberBound(4)).toEqual(failure('less than 5', 4))
})

test('key value objects proof', () => {
  const validShape = p.shape({
    one: prove<string>((x) => is.string(x) || 'expected string'),
    two: p.shape({ three: prove<number>((x) => is.number(x) || 'expected number') }),
  })

  const valid = validShape({ one: 'foo', two: { three: 10 } })
  expect(valid).toEqual([null, { one: 'foo', two: { three: 10 } }])

  const inValid = validShape({ one: 'foo', two: { three: 'bar' as any } })
  expect(inValid).toEqual([
    outputString({ two: { three: 'expected number' } }),
    { one: 'foo', two: { three: 'bar' } },
  ])

  if (isFailure(valid)) return
  type Tests = Test<Equals<{ one: string; two: { three: number } }, typeof valid[1]>>
})

test('array proof', () => {
  const validArray = p.array(p.string)
  const valid = validArray(['one', 'two'])
  expect(valid).toEqual([null, ['one', 'two']])

  const inValid = validArray(['one', 'two', 10 as any])
  expect(inValid).toEqual(['[ ([2] Expected string) ]', ['one', 'two', 10]])
})

test('or proof', () => {
  const validate = p.or(p.string, p.number)
  const valid = validate('foobar')
  expect(valid).toEqual([null, 'foobar'])

  const invalid = validate(true as any)
  expect(invalid).toEqual(['value not match any proofs', true])

  if (isFailure(valid)) return
  type Tests = Test<Equals<string | number, typeof valid[1]>>
})

test('valid proof', () => {
  expect(valid(prove<number>((x) => typeof x === 'number' || 'expected number'))(10)).toEqual(true)
  expect(valid(prove<number>((x) => typeof x === 'number' || 'expected number'))('foo')).toEqual(
    'expected number'
  )
})

test('custom proof using valid', () => {
  type Person = { name: string; age: number }
  const person = prove<Person>(valid(p.shape({ name: p.string, age: p.number })))
  const result = person({ name: 'John', age: 10 })

  expect(result).toEqual([null, { name: 'John', age: 10 }])

  if (isFailure(result)) return
  type Tests = Test<Equals<Person, typeof result[1]>>
})
