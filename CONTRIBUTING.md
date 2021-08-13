### fabricjs-psbrush

[![build](https://github.com/arch-inc/fabricjs-psbrush/workflows/npm-publish/badge.svg)](https://github.com/arch-inc/fabricjs-psbrush/actions?query=workflow%3Anpm-publish)
[![npm version](https://img.shields.io/npm/v/@arch-inc/fabricjs-psbrush)](https://www.npmjs.com/package/@arch-inc/fabricjs-psbrush)

#### How to contribute

We're really glad you're reading this! We appreciate your contributions.

Please send a [GitHub Pull Request to arch-inc/fabricjs-psbrush](https://github.com/arch-inc/fabricjs-psbrush/pull/new/main) with a clear list of what you've done (read more about [pull requests](http://help.github.com/pull-requests/)). Please follow our coding conventions (below) and make sure your pull request is atomic (one feature per PR).

#### Directory structure

- `lib`: library source code, built with [rollup.js](https://rollupjs.org/) and published automatically to [npmjs.com](https://www.npmjs.com/) with [GitHub Actions](https://github.com/arch-inc/fabricjs-psbrush/blob/main/.github/workflows/publish.yml).
- `docs`: [Next.js](https://nextjs.org/)-based example code, built and deployed automatically to [gh-pages](https://github.com/arch-inc/fabricjs-psbrush/tree/gh-pages) branch with [GitHub Actions](https://github.com/arch-inc/fabricjs-psbrush/blob/main/.github/workflows/gh-pages.yml).

#### Coding conventions

The following conventions are defined in [.editorconfig](https://github.com/arch-inc/fabricjs-psbrush/blob/main/.editorconfig).

- We use UTF-8 encoding
- We indent using two spaces (soft tabs)

We also use [Prettier](https://prettier.io/)  to format source code. The following command will apply Prettier to all of the TypeScript source code.

```sh
npm run prettify
```

---
Copyright (c) 2020 Arch Inc. (Jun Kato, Kenta Hara)