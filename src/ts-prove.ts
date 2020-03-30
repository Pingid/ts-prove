export { Valid, Success, Failure, Proof, TypeOfProof as ProofType, Check } from './types'
export { is, outputString } from './utils'

export { isFailure, isSuccess, valid, failure, success } from './prove'
import prove from './prove'
export default prove
