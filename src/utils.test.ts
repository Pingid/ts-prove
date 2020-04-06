import { outputString, is, isProved, failure, success, check } from './utils'
import prove from './prove'

const types = [
  'string',
  10,
  undefined,
  null,
  { one: 'foobar' },
  ['foobar'],
  true,
  false,
  Symbol(),
  () => null,
]

test('utility funcs', () => {
  expect(is<string>((x) => typeof x === 'string')('')).toBe(true)
})

test('Checking native types', () => {
  expect(is.string('string')).toBe(true)
  types.filter((x) => x !== 'string').forEach((x) => expect(is.string(x)).toBe(false))

  expect(is.number(10)).toBe(true)
  types.filter((x) => x !== 10).forEach((x) => expect(is.number(x)).toBe(false))

  expect(is.boolean(false)).toBe(true)
  expect(is.boolean(true)).toBe(true)
  types.filter((x) => x !== true && x !== false).forEach((x) => expect(is.boolean(x)).toBe(false))

  expect(is.symbol(Symbol())).toBe(true)
  types.filter((x) => typeof x !== 'symbol').forEach((x) => expect(is.symbol(x)).toBe(false))

  expect(is.null(null)).toBe(true)
  types.filter((x) => x !== null).forEach((x) => expect(is.null(x)).toBe(false))

  expect(is.undefined(undefined)).toBe(true)
  types.filter((x) => x !== undefined).forEach((x) => expect(is.undefined(x)).toBe(false))

  expect(is.function(() => null)).toBe(true)
  types.filter((x) => typeof x !== 'function').forEach((x) => expect(is.function(x)).toBe(false))

  expect(is.shape({})).toBe(true)
  types.filter((x) => !(x && (x as any).one)).forEach((x) => expect(is.shape(x)).toBe(false))

  expect(is.array([])).toBe(true)
  types
    .filter((x) => !(x && (x as any)[0] === 'foobar'))
    .forEach((x) => expect(is.array(x)).toBe(false))
})

test('outputString', () => {
  expect(outputString(10)).toBe('10')
  expect(outputString(null)).toBe('null')
  expect(outputString(undefined)).toBe('undefined')
  expect(outputString('10')).toBe('10')
  expect(outputString({ one: 'fooobar' })).toBe(`{\n  one: fooobar\n}`)
})

test('isProved', () => {
  expect(isProved(failure('', null))).toEqual(false)
  expect(isProved(success(''))).toEqual(true)
})

test('check', () => {
  expect(check(prove((x) => true))(null)).toEqual(true)
  expect(check(prove((x) => 'error'))(null)).toEqual('error')
  expect(() => check(prove((x) => 'error'))(() => null)).toThrow()
})
