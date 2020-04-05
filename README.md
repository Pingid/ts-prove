# TS Prove

A lightweight decoding and validation library.

[![GitHub Workflow Status](https://img.shields.io/github/workflow/status/Pingid/ts-prove/CI)](https://github.com/Pingid/ts-prove/actions)
[![Coverage Status](https://coveralls.io/repos/github/Pingid/ts-prove/badge.svg?branch=master)](https://coveralls.io/github/Pingid/ts-prove?branch=master)
![Package Size](https://img.shields.io/bundlephobia/min/ts-prove)

## About

This library provides a set of composable functions for typesafe schema validation and data decoding. The decoders or 'proofs' that are provided by the library also return structured error outputs which can be harnessed for message validation in, for example, serverside request handlers.

## Install

```
npm install ts-prove
yarn add ts-prove
```



## Documentation

- [Example](##Example)
- [Data Validation](##Data Validation)
- [Custom Proofs](##Custom Proofs)
- [API](##API)

## Example

In the example below, we construct a *proof* for the type `Person<{ name: string, age: number }>`. This proof is a callback which accepts some unknown data and returns either `Failure<[string, unknown]>` or `Success<[null, { name: string, age: number }]>`

```ts
import P, { TypeOfProof } from 'ts-prove'

const nameProof = P.shape({
  first: P.string,
  last: P.optional(P.string)
})

const personProof = P.shape({
  name: nameProof,
  age: P.number
})

type Person = TypeOfProof<typeof personProof> 
// { name: { first: string, last?: string }, age: number }

personProof({ name: { first: 'Bob' }, age: 'Incorect string value' }) // [string, unknown]
personProof({ name: { first: 'Bob' }, age: 10 }) // [null, Person]
```

Here is an example of how this can be used in a route handler to safely set the type of some POST data.

```ts
export const createPerson = (req) => {
  const data = person(req.body)
  if (isFailure(data)) return req.send({ status: 500, body: data[0] })
  return db.createPerson(data[1])
}

db.createPerson = (p: Person) => void
```

## Data Validation

Every proof is curried and accepts either a function of type `(x: unknown) => true | string` or some other value. When supplied with a function, a proof returns an instance of itself narrowed by the constraints of the callback. In the example bellow we use this feature to further narrow the number type to numbers betwen 10 and 19.

```ts
const teenage = P.number((x) => x > 10 || 'To young')((x) => x < 19 || 'To old')

teenage(9) // ['To young', unknown]
teenage(20) // ['To old', unknown]
teenage(13) // [null, number]

// This could then be used in a structured proof
const teenager = P.shape({ name: nameProof, age: teenage })
```

## Custom Proofs

All the proofs provided by this library are constructed using the function `P<ValueType>()`.

```ts
P.string = P<string>(x => typeof x === 'string' || 'Expected string')
```

We can use `P` to construct are own proofs by providing are return type as the type argument to P. Here is a generic proof which does a deep equal comparison using lodash.isequal function.

```ts
import P, { isFailure, Proof } from 'ts-prove'
import isEqual from 'lodash.isequal'

const equalProof = <T extends any>(type: T) => P<T>((input) => isEqual(type, input) | `Not equal`)
```

Under the hood `P` takes advantage of a type guard API also provided by this libarary

```ts
import { is } from 'ts-prove';

is.string(10) // false

const isPerson = is<Person>(x => x && x.name && x.name.first && x.age);
isPerson({ name: { first: 'John' }, age: 42 }) // true
```



## API

#### Types

| Type      | Definition |
| ---------- | ------------------------ |
| Sucess<T>  | [null, T]                |
|  Failure              | [string, unknown]        |
| Check<T=unknown> | (x: T) => true \| string |
| Proof<R> 		   | <T extends Check<R> \| R>(x: T): T extends Check<R> ? Proof<R> : Success<R> \| Failure |

#### Proofs

Every proof sites in the default export namespace.

| Primitives | Type definition  |
| ---------- | ---------------- |
| string     | Proof<string>    |
| number     | Proof<number>    |
| boolean    | Proof<boolean>   |
| symbol     | Proof<symbol>    |
| undefined  | Proof<undefined> |

| Structured                                                   | Type definition                                              |      |
| ------------------------------------------------------------ | ------------------------------------------------------------ | ---- |
| array                                                        | Proof<any[]>                                                 |      |
| arrayOf                                                      | <T extends Proof<any>>(prf: T): Proof<TypeOfProof<T>[]>      |      |
|                                                              | `P.arrayOf(P.string) // string[]`                            |      |
| shape                                                        | <T extends { [x: string]: Proof<any> }>(prf: T): Proof<{ [Key in keyof T]: TypeOfProof<T[Key]> }> |      |
|                                                              | `P.shape({ name: P.string }) // { name: string }`            |      |
| optional *(For use in shapes to indicate an optional value)* | <T extends Proof<any>>(*prf*: T): Proof<TypeOfProof<T> \| undefined> |      |
|                                                              | `P.shape({ name: P.optional(P.string) }) // { name?: string} ` |      |
| or                                                           | <T extends Proof<any>[]>(...*proofs*: T): Proof<TypeOfProof<T[number]>> |      |
|                                                              | `P.or(P.string, P.number) // string | number`                |      |


#### Helpers

- **isSuccess(x : Failure | Success<T>): boolean** 
- **isFailure(x : Failure | Success<T>): boolean** 
- **valid(x : Failure | Success<T>): boolean): string | true**
- **result<T>(x: T, isValid: true | string): Failure | Success<T>**



This project follows the [all-contributors](https://github.com/kentcdodds/all-contributors) specification. Contributions of any kind are welcome!