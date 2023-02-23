# Apicurio API Designer

This project is the main UI project for Apicurio API Designer.  API Designer is the successor
to Apicurio Studio.

## What's inside?

This repository includes the following packages/apps:

### Apps and Packages

- `web`: the main web application
- `ui`: a React component library used by `web` and published to npmjs
- `tsconfig`: `tsconfig.json`s used throughout the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This repository has some tools it requires:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [pnpm](https://pnpm.io/) for package management


## Using this repository

Run the following commands:

```sh
pnpm install
pnpm run dev
```

This will install all dependencies and then run the application in development mode.
A browser window should open automatically, but if not, you can go here:

http://localhost:3000/
