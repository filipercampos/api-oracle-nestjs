<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development mode (watch)
$ npm run dev

# debug mode
$ npm run debug

# production mode
$ npm start
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Promise

The difference is in how you're handing Promises.

If you're using await to handle the Promise then you wrap it in a try/catch. Think of await as a way to make asynchronous operations semantically similar to synchronous operations.

But if you're not using await and are instead handling the Promise by appending .then() to it then you'd append a .catch() to that chain to catch failures from within the asynchronous operation.
