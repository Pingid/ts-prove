# TS Prove

A lightweight decoding and validation library.

[![GitHub Workflow Status](https://img.shields.io/github/workflow/status/Pingid/ts-prove/CI)](https://github.com/Pingid/ts-prove/actions)
[![Coverage Status](https://coveralls.io/repos/github/Pingid/ts-prove/badge.svg?branch=master)](https://coveralls.io/github/Pingid/ts-prove?branch=master)
![Package Size](https://img.shields.io/bundlephobia/min/ts-prove)

## About

This library provides a set of composable functions for typesafe schema validation and data decoding. Because typescript is staticaly typed this can be particularly useful for message validation in, for example, a HTTP route handler by ensuring that the correct data is available.

## Install

```
npm install ts-prove
yarn add ts-prove
```

## Documentation

- [Example](#Example)
- [Validation](#Validation)
- [Proofs](#Proofs)
- [API](#API)

## Example

In the example below, we construct a _proof_ for the type `Person<{ name: { first: string, last: string }, age: number }>`. This proof is a callback which accepts some unknown data and returns either `Failure<[string, unknown]>` or `Success<[null, Person]>`

```ts
import P, { ProofType } from 'ts-prove'

const proveName = P.shape({
  first: P.string,
  last: P.optional(P.string),
})

const provePerson = P.shape({
  name: proveName,
  age: P.number,
})

type Person = ProofType<typeof provePerson>
// { name: { first: string, last?: string }, age: number }

provePerson({ name: { first: 'Bob' }, age: 'Incorect string value' }) // [string, unknown]
provePerson({ name: { first: 'Bob' }, age: 10 }) // [null, Person]
```

This could then be used to validate a payload.

```ts
import { isProved } from 'ts-prove'

export const createPerson = (req) => {
  const data = person(req.body)
  if (!isProved(data)) return req.send({ status: 500, body: data[0] })
  return db.createPerson(data[1])
}

db.createPerson = (p: Person) => void
```

## Validation

Every proof is curried and accepts either a function of type `(x: unknown) => true | string` or some other value. When supplied with a function, a proof returns an instance of itself narrowed by the constraints of the callback. In the example bellow we use this feature to further narrow the number type to numbers betwen 10 and 19.

```ts
const teenage = P.number((x) => x > 10 || 'To young')((x) => x < 19 || 'To old')

teenage(9) // ['To young', unknown]
teenage(20) // ['To old', unknown]
teenage(13) // [null, number]

// This could then be used in a structured proof
const teenager = P.shape({ name: nameProof, age: teenage })
```

## Proofs

All the proofs provided by this library are constructed using the function `P<ValueType>(): Proof<ValueType>`. We can use `P` to construct are own proofs by providing a return type as the type argument.

```ts
P.string = P<string>((x) => typeof x === 'string' || 'Expected string')
```

Here is a generic proof which does a deep equal comparison using lodash.isequal function.

```ts
import P from 'ts-prove'
import isEqual from 'lodash.isequal'

const equalProof = <T extends any>(type: T) => P<T>((input) => isEqual(type, input) | `Not equal`)
```

## API

#### Type definitions

| Type                   | Definition                                                                                                             |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Sucess\<T>             | [**null**, **T**]                                                                                                      |
| Failure                | [**string**, **unknown**]                                                                                              |
| Check<**T**=_unknown_> | (value: **T**) => **true** \| **string**                                                                               |
| Proof\<**R**>          | <T \*extends **Check\<R>** \| **R\***>(x: **T**): T extends Check\<R> ? **Proof\<R>** : **Success\<R>** \| **Failure** |

#### P: Proof

Accepts a return type argument and a validation function that returns a failure of type string or boolean true.

- **string:** Proof<_string_>
- **number:** Proof<_number_>
- **boolean:** Proof<_boolean_>
- **symbol:** Proof<_symbol_>
- **null:** Proof<_null_>
- **undefined:** Proof<_undefined_>

_Two utility proofs that always match but that resolve to different types._

- **any:** Proof\<_any_\>
- **unknown:** Proof\<_unknown_\>

* **array:** <**T** _extends Proof\<any\>_>(proof: **T**): **Proof**<\*ProofType\<**T**\>**[]\***>

  - Accepts a proof T as an argument and returns a proof for arrays containing type T.

  - ```ts
    P.array(P.string)
    // string[]
    ```

* **shape:** <**T** _extends { [x: string]: Proof\<any\> }_>(proof: **T**): **Proof**<_{ [Key in keyof **T**]: ProofType<**T[Key]**> }_>

  - Accepts a key value object where every value is a proof and returns a proof for objects of that shape.

  - ```ts
    P.shape({ name: P.string, age: P.number })
    // { name: string, age: number }
    ```

* **optional:** <**T** _extends Proof\<any\>_>(proof: **T**): **Proof**<\*ProofType\<**T**\> | **undefined\***>

  - For use in shapes when you want the return type to indicate and optional value. Optional accepts a proof as an argument and returns union with undefined. For any other cases use **or**.

  - ```ts
    P.shape({ name: P.string, age: P.optional(P.number) })
    // { name: string, age?: number }
    ```

* **or**: <**T** _extends Proof\<any\>[]_>(...proofs: **T**): **Proof**<_ProofType\<**T[number]**\>_>

  - Accepts any number of proofs as arguments and returns a union of thoses proofs if any one of them match a given value.

  - ```ts
    P.or(P.string, P.number, P.symbol)
    // string | number | symbol
    ```

#### Helper functions

- **isProved**: \<**T** _extends any_>(**x** : Failure | Success\<**T**>): **x** is Success\<**T**>

  - Type guard for the return type of a proof

- **check:** (**proof**: Proof\<any>): Check\<_unknown_>
  - Used to convert a proof to a check

_Type guard library coming soon..._

This project follows the [all-contributors](https://github.com/kentcdodds/all-contributors) specification. Contributions of any kind are welcome!
