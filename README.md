# TS Prove

A composable typesafe library for decoding ambiguas data and validating structured types.

[![GitHub Workflow Status](https://img.shields.io/github/workflow/status/Pingid/ts-prove/CI)](https://github.com/Pingid/ts-prove/actions)
[![Coverage Status](https://coveralls.io/repos/github/Pingid/ts-prove/badge.svg?branch=master)](https://coveralls.io/github/Pingid/ts-prove?branch=master)
[![Dev Dependencies](https://david-dm.org/Pingid/ts-prove/dev-status.svg)](https://david-dm.org/Pingid/ts-prove)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

## installing

```
npm install ts-prove
yarn add ts-prove
```

## Api

The libary provides a list of curried composable validation functions.

`p: { string, number, null, undefined, any, unknown, oneOf, array, shape }`

```ts
const validateString = p.string()
validateString('Hello World') // [null, 'Hello World'"]
```

These can be composed into more complex structures ie for validating client requests on a server.

```ts
const createPersonPayload = p.shape({
    name: p.string()
    friends: p.array(p.oneOf(
        p.string(),
        p.shape({ id: p.string() })
    ))
})

const handler = (event, context) => {
    const [error, payload] = createPersonPayload(JSON.parse(event.body))

    // Returns structured errors
    // ['{ name: "John", friends: [ ([10] { id: __missing__ }) ] }', unknown]
    if (error !== null) return { statusCode: 500, body error}

    // And fully typed payloads
    // payload: [null, { name: string, friends: (string | { id: string })[] } ]
}
```

This project follows the [all-contributors](https://github.com/kentcdodds/all-contributors) specification. Contributions of any kind are welcome!
