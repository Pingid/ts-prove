# TS Prove

A lightweight decoding and validation library.

[![GitHub Workflow Status](https://img.shields.io/github/workflow/status/Pingid/ts-prove/CI)](https://github.com/Pingid/ts-prove/actions)
[![Coverage Status](https://coveralls.io/repos/github/Pingid/ts-prove/badge.svg?branch=master)](https://coveralls.io/github/Pingid/ts-prove?branch=master)
[![Dev Dependencies](https://david-dm.org/Pingid/ts-prove/dev-status.svg)](https://david-dm.org/Pingid/ts-prove)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

## install

```
npm install ts-prove
yarn add ts-prove
```

## use

The library provides a set of composable functions for typesafe schema validation and ambiguas data decoding. Along with a standered library of decoders the library also provides readable structered error outputs making it especially usefull for structured message validation such as in HTTP requests.

At its most basic it can be used to validate simple structerd data.

```ts
import p, { isFailure } from 'ts-prove'

const person = p.shape({ name: p.string, age: p.number })

person({ name: 'Dug', age: '10' }) // ["{ age: expected number }", unknown]
person({ name: 'Dug', age: 10 }) // [null, { name: string, age: number ]

// This could be used validate post data at an endpoint
export const createPerson = (req) => {
  const data = person(req.body)
  if (isFailure(data)) return req.send({ status: 500, body: data[0] })
  return db.createPerson(data[1])
}
```

## validate

Every proof can receive either a callback `(x => true | string)` or some other value. When provided with a calback it returns another instance of itself using the provided callback to validate later values.

```ts
import p from 'ts-prove'

const teenage = p.number((x) => x > 10 || 'To young')((x) => x < 19 || 'To old')

teenage(9) // ['To young', unknown]
teenage(20) // ['To old', unknown]

// This could then be used in a structured proof
const teenager = p.shape({ name: p.string, age: teenage })
```

## custom

The entire standered library of proofs is built using the `prove` function which can be used to build your own custom proofs. Because a proof returns a tuple but the isValid callback for a proof requires a function which returns `true | string` there is a helper function `valid` to transform between the two.

```ts
import p, { prove, valid } from 'ts-prove'

// You can compose your own custom types by wrapping a proof with the valid function
type Person = { name: string; age: number }
const person = prove<Person>(valid(p.shape({ name: string, age: p.number })))

// Example of p.string implimentation
const string = prove<string>((x) => typeof x === 'string' || 'Expected string')
```

This project follows the [all-contributors](https://github.com/kentcdodds/all-contributors) specification. Contributions of any kind are welcome!
