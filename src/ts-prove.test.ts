import p, { prove, isFailure } from './ts-prove'
import { isString, isNumber, toString } from './utils'

type Equals<A extends any, B extends A> = A extends B ? 'pass' : never
type Test<T extends 'pass'> = true

test('prove accepts value', () => {
  const result = prove(10)
  expect(result).toEqual([null, 10])
})

test('prove accepts arbitrary number of validation callbacks', () => {
  const numberBound = prove<number>((x) => x > 5 || 'less than 5')(
    (x) => x < 10 || 'greater than 10'
  )

  expect(numberBound(6)).toEqual([null, 6])
  expect(numberBound(11)).toEqual(['greater than 10', 11])
  expect(numberBound(4)).toEqual(['less than 5', 4])
})

test('key value object proofs structures', () => {
  const validShape = p.shape({
    one: prove<string>((x) => isString(x) || 'expected string'),
    two: p.shape({ three: prove<number>((x) => isNumber(x) || 'expected number') }),
  })

  const valid = validShape({ one: 'foo', two: { three: 10 } })
  expect(valid).toEqual([null, { one: 'foo', two: { three: 10 } }])

  const inValid = validShape({ one: 'foo', two: { three: 'bar' as any } })
  expect(inValid).toEqual([
    toString({ two: { three: 'expected number' } }),
    { one: 'foo', two: { three: 'bar' } },
  ])

  if (isFailure(valid)) return
  type Tests = Test<Equals<{ one: string; two: { three: number } }, typeof valid[1]>>
})

test('proof for array structures', () => {
  const validArray = p.array(p.string)
  const valid = validArray(['one', 'two'])
  expect(valid).toEqual([null, ['one', 'two']])

  const inValid = validArray(['one', 'two', 10 as any])
  expect(inValid).toEqual(['[ ([2] Expected string) ]', ['one', 'two', 10]])
})

test('oneOf', () => {
  const validate = p.oneOf(p.string, p.number)
  const valid = validate('foobar')
  expect(valid).toEqual([null, 'foobar'])

  const invalid = validate(true as any)
  expect(invalid).toEqual(['value not match any proofs', true])

  if (isFailure(valid)) return
  type Tests = Test<Equals<string | number, typeof valid[1]>>
})
