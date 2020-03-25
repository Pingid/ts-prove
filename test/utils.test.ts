import { guard, toString } from '../src/utils'

const types = [
  'string',
  10,
  undefined,
  null,
  { one: 'foobar' },
  ['foobar'],
  true,
  false,
  () => null
]

test('Checking native types', () => {
  expect(guard.string('string')).toBe(true)
  types.filter(x => x !== 'string').forEach(x => expect(guard.string(x)).toBe(false))

  expect(guard.number(10)).toBe(true)
  types.filter(x => x !== 10).forEach(x => expect(guard.number(x)).toBe(false))

  expect(guard.boolean(false)).toBe(true)
  expect(guard.boolean(true)).toBe(true)
  types.filter(x => x !== true && x !== false).forEach(x => expect(guard.boolean(x)).toBe(false))

  expect(guard.null(null)).toBe(true)
  types.filter(x => x !== null).forEach(x => expect(guard.null(x)).toBe(false))

  expect(guard.undefined(undefined)).toBe(true)
  types.filter(x => x !== undefined).forEach(x => expect(guard.undefined(x)).toBe(false))

  expect(guard.function(() => null)).toBe(true)
  types.filter(x => typeof x !== 'function').forEach(x => expect(guard.function(x)).toBe(false))

  expect(guard.shape({})).toBe(true)
  types.filter(x => !(x && (x as any).one)).forEach(x => expect(guard.shape(x)).toBe(false))

  expect(guard.array([])).toBe(true)
  types
    .filter(x => !(x && (x as any)[0] === 'foobar'))
    .forEach(x => expect(guard.array(x)).toBe(false))
})

test('toString', () => {
  expect(toString(10)).toBe('10')
  expect(toString(null)).toBe('null')
  expect(toString(undefined)).toBe('undefined')
  expect(toString('10')).toBe('10')
  expect(toString({})).toBe('{}')
  expect(toString([10, 11, 12])).toBe('[ 10, 11, 12 ]')
  expect(toString({ one: 'fooobar' })).toBe(`{\n  one: fooobar\n}`)
})
