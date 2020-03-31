export { Valid, Success, Failure, Proof, TypeOfProof as ProofType, Check } from './types'
export { is, outputString, isFailure, isSuccess, valid, failure, success } from './utils'

import prove from './prove'
export default prove
