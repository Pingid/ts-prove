import { isString } from 'util'
import { is, isFunction, hasKey, toString } from './utils'
import { Failure, Success } from './types'

export type Valid<T extends any = unknown> = (x: T) => true | string
type UnWrap<T> = T extends Validator<infer D> ? D : never
type Validator<R extends any> = {
  <T extends Valid<R> | R>(x: T): T extends Valid<R> ? Validator<R> : Failure<unknown> | Success<R>
}
type ValidTReturn<R extends any> = Validator<R> | Failure<unknown> | Success<R>

const isReturn = <T extends ValidTReturn<R>, R extends any>(x: T) =>
  is<Failure<unknown> | Success<R>>((y) => Array.isArray(y))(x)

const isFailure = is<Failure<any>>((x) => !!(x && (x as any)[0] && isString((x as any)[0])))
const isSuccess = is<Success<any>>((y) => y && (y as any)[0] === null)

const valid = <T extends any>(x: T | Valid<T>, trs: Valid<T>[] = []): Validator<T> =>
  is<Valid<T>>(isFunction)(x)
    ? (y) => valid<T>(y, [...trs, x])
    : (trs.reduce<Failure<unknown> | Success<T>>(
        (a, b) => {
          const res = b(x)
          if (isFailure(a) || res === true) return a
          return [res, a[1]]
        },
        [null, x] as Success<T>
      ) as any)

test('Validator accept value', () => {
  expect(valid(10)).toEqual([null, 10])
})

test('Validator accept arbitrary number of validation callbacks', () => {
  const numberBound = valid<number>((x) => x > 5 || 'less than 5')(
    (x) => x < 10 || 'greater than 10'
  )
  expect(numberBound(6)).toEqual([null, 6])
  expect(numberBound(11)).toEqual(['greater than 10', 11])
  expect(numberBound(4)).toEqual(['less than 5', 4])
})

const keys = <T extends Record<any, any>>(x: T) => Object.keys(x) as (keyof T)[]
type UnwrapShape<T extends Record<any, Validator<any>>> = { [Key in keyof T]: UnWrap<T[Key]> }

test('Data structures', () => {
  const shape = <T extends Record<any, Validator<any>>>(y: T) =>
    valid<{ [Key in keyof T]: UnWrap<T[Key]> }>((x) =>
      keys(y).reduce<string | true>((a, b) => {
        if (isString(a)) return a
        if (!hasKey(b, x)) return toString({ ...(a as any)[1], [b]: '__missing__' })
        const res = y[b](x[b])
        if (isFailure(res)) return toString({ ...(a as any)[1], [b]: res[0] })
        return a
      }, true)
    )

  const validShape = shape({
    one: valid<string>((x) => isString(x) || 'expected string'),
    two: shape({ three: valid<number>((x) => isString(x) || 'expected string') }),
  })

  const n = validShape({ one: '10', two: { three: 10 } })

  if (isSuccess(n)) {
    const g = n
  }
})
