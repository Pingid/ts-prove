import { prove, proofs, Proof, ProofOf, isSuccess } from './prove'
import { isString } from './utils'

test('Validator accept value', () => {
  expect(prove(10)).toEqual([null, 10])
})

test('Validator accept arbitrary number of validation callbacks', () => {
  const numberBound = prove<number>((x) => x > 5 || 'less than 5')(
    (x) => x < 10 || 'greater than 10'
  )
  expect(numberBound(6)).toEqual([null, 6])
  expect(numberBound(11)).toEqual(['greater than 10', 11])
  expect(numberBound(4)).toEqual(['less than 5', 4])
})

test('Data structures', () => {
  const validShape = proofs.shape({
    one: prove<string>((x) => isString(x) || 'expected string'),
    two: proofs.shape({ three: prove<number>((x) => isString(x) || 'expected string') }),
  })

  const n = validShape({ one: '10', two: { three: 10 } })

  if (isSuccess(n)) {
    const g = n
  }
})
