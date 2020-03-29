# TS Prove

A lightweight decoding and validation library.

[![GitHub Workflow Status](https://img.shields.io/github/workflow/status/Pingid/ts-prove/CI)](https://github.com/Pingid/ts-prove/actions)
[![Coverage Status](https://coveralls.io/repos/github/Pingid/ts-prove/badge.svg?branch=master)](https://coveralls.io/github/Pingid/ts-prove?branch=master)
[![Dev Dependencies](https://david-dm.org/Pingid/ts-prove/dev-status.svg)](https://david-dm.org/Pingid/ts-prove)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

## installing

```
npm install ts-prove
yarn add ts-prove
```

## What is this then

The library provides a set of composable functions for typesafe schema validation and ambiguas data decoding. Along with a standered library of decoders the library also provides readable structered error outputs making it especially usefull for structured message validation such as in HTTP requests.

At its most basic it can be used to validate simple structerd data.

```ts
import p, { isFailure } from 'ts-prove'

const person = p.shape({ name: p.string, age: p.number })

console.log(person({ name: 'Dug', age: '10' }))
// ["{ age: expected number }", unknown]

console.log(person({ name: 'Dug', age: 10 }))
// [null, { name: string, age: number ]

export const createPerson = (req) => {
  const person = proveIsPerson(req.body)
  if (isFailure(person)) return req.send({ status: 500, body: person[0] })
  return db.create(person[1])
}
```

## Validation

Every proof can receive either a callback `(x => true | string)` or some other value. When provided with a calback it returns another instance of itself using the provided callback to validate later values.

```ts
import p from 'ts-prove'

const teenage = p.number
  (x => x > 10 || 'To young')
  (x => x < 19 || 'To old)

console.log(teenage(9))
// ['To young', unknown]

console.log(teenage(20))
// ['To old', unknown]

// This could then be used in a structured proof
const teenager = p.shape({ name: p.string, age: teenage });
```

The entire standered proof library is built like this and can be expanded on using the prove function.

```ts
import p, { prove, valid } from 'ts-prove'

// Example of p.string implimentation
const string = prove<string>((x) => typeof x === 'string' || 'Expected string')

// You can compose your own custom types by wrapping a proof with the valid function
type Person = { name: string; age: number }
const person = prove<Person>(valid(p.shape({ name: string, age: p.number })))
```

This project follows the [all-contributors](https://github.com/kentcdodds/all-contributors) specification. Contributions of any kind are welcome!
