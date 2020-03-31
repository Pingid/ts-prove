import { Check, Value, Proof, TypeOfProof, Valid } from './types'
import { is, outputString, isFailure, valid, result } from './utils'

/**
 * Where the magic happens
 */
const prove = <T extends Check<T> | Value>(
  valueOrCheck: T | Check<T>,
  trs: Check<T>[] = []
): Proof<T> =>
  is<Check<T>>(is.function)(valueOrCheck)
    ? (y) => prove(y, [...trs, valueOrCheck])
    : (result(
        valueOrCheck,
        trs.reduce<Valid>((a, b) => (a !== true ? a : b(valueOrCheck)), true)
      ) as any)

/**
 * Proof for javasript primitives
 */
prove.string = prove<string>((x) => is.string(x) || 'Expected string')
prove.number = prove<number>((x) => is.number(x) || 'Expected number')
prove.boolean = prove<boolean>((x) => is.boolean(x) || 'Expected boolean')
prove.symbol = prove<symbol>((x) => is.symbol(x) || 'Expected symbol')
prove.null = prove<null>((x) => is.null(x) || 'Expected null')
prove.undefined = prove<undefined>((x) => is.undefined(x) || 'Expected undefined')
prove.array = prove<any[]>((x) => is.array(x) || 'Expected array')

/**
 * Structured key value Proof
 */
prove.shape = <T extends Record<any, Proof<any>>>(shp: T) =>
  prove<{ [Key in keyof T]: TypeOfProof<T[Key]> }>((x) =>
    Object.keys(shp).reduce<Valid>((a, b) => {
      if (!x[b]) return outputString({ ...(a as any)[1], [b]: '__missing__' })
      const res = shp[b](x[b])
      if (isFailure(res)) return outputString({ ...(a as any)[1], [b]: res[0] })
      return true
    }, true)
  )

/**
 * Structured array Proof
 */
prove.arrayOf = <T extends Proof<any>>(arrayOf: T) =>
  prove<TypeOfProof<T>[]>(valid(prove.array))((y) =>
    y.reduce<Valid>((a, b, i) => {
      if (is.string(a)) return a
      const res = arrayOf(b)
      if (isFailure(res)) return `[ ([${i}] ${res[0]}) ]`
      return a
    }, true)
  )

/**
 * Logical proof which checks that item is one of some type
 */
prove.or = <T extends Proof<any>[]>(...proofs: T) =>
  prove<TypeOfProof<T[number]>>((value) =>
    proofs.reduce<Valid>((a, prf) => {
      if (a === true) return true
      const result = valid(prf)(value)
      return result === true
        ? true
        : (a + (a.length > 0 ? ' or ' : '') + result).replace(/\sExpected/gi, '')
    }, '')
  )

/**
 * Strict equals
 */
prove.equals = <T extends any>(value: T) =>
  prove<T>(
    (input) => input === value || `${outputString(value)} is not equal to ${outputString(input)}`
  )

export default prove
