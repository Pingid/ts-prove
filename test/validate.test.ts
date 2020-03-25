import v, { validate } from '../src/ts-prove'

test('validate schema', () => {
  const result = validate(v.shape({ one: v.string() }))({ one: 'foobar' })
  expect(result.value).toEqual({ one: 'foobar' })
})
