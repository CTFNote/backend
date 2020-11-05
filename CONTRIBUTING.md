# Contributing

Thanks for contributing! :smile:

The following is a set of guidelines for contributing. These are mostly guidelines, not rules. Use your best judgment, and feel free to propose changes to this document in a pull request.

> Note: Contributions should be made via pull requests to the dev branch of the repository.

## Table of Contents

- [Contributing](#contributing)
  - [Table of Contents](#table-of-contents)
- [Guidelines](#guidelines)
  - [Styleguides](#styleguides)
    - [Commit Messages](#commit-messages)
    - [Issues](#issues)
    - [Code Styleguide](#code-styleguide)
    - [Pull Requests](#pull-requests)
  - [What should I know before I get started (TODO)](#what-should-i-know-before-i-get-started-todo)
  - [How Can I Contribute](#how-can-i-contribute)

# Guidelines

The following are the guidelines we request you to follow in order to contribute to this project.

## Styleguides

### Commit Messages

This project follows the [Conventional Commits][conventional] and [`@commitlint/conventional-commit`][commitlint-conventional] convention. All git commits get linted using [`@commitlint/cli`][commitlintcli]. Along with that, commit titles should be in the imperative present tense form.

Examples of valid commit messages:

- ```txt
  fix(parser): fix URL parser
  ```

- ```txt
  refactor(api): add route for registering

  BREAKING CHANGE: Route no longer resides at `/api/users/register`, moved to `/api/auth/register`

  Moved for consistency between everything auth related

  See #4
  See #10
  ```

Examples of invalid commit messages:

- ```txt
  remove some stuff
  ```

- ```txt
  fix a bug

  some stuff wasnt working so i fixed it
  ```

### Issues

For issues, please use one of the available templates. If none of the templates fit, create an issue without following a template, but include as much information as possible.

### Code Styleguide

The code should satisfy the following:

- Have meaningful variable names in `camelCase` format.
- Have no issues when running `yarn run lint`.
- Have a scope for easy fixing, refactoring and scaling.
- If applicable, have meaningful file names, directory names and directory structure.

### Pull Requests

Pull requests should have:

- A concise commit message.
- A description of what was changed/added.

## What should I know before I get started (TODO)

You can contribute to any of the features you want, here's what you need to know:

- How the project works.
- The technology stack used for the project.
- A brief idea about writing documentation.

## How Can I Contribute

You can contribute by:

- Reporting Bugs
- Suggesting Enhancements
- Code Contribution
- Pull Requests

Make sure to document the contributions well in the pull request.

> It is not compulsory to follow the guidelines mentioned above, but it is strongly recommended.

[commit-message-guidelines]: https://github.com/trein/dev-best-practices/wiki/Git-Commit-Best-Practices#write-good-commit-messages
[commitlint-conventional]: https://github.com/conventional-changelog/commitlint/tree/master/%40commitlint/config-conventional
[conventional]: https://www.conventionalcommits.org/en/v1.0.0/
[commitlintcli]: https://commitlint.js.org/
