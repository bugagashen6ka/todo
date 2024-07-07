# Todo App Monorepo

- [Assignment](#assignment)
- [Prerequisites](#prerequisites)
- [Running Todo App Locally](#running-todo-app-locally)
- [Testing](#testing)
- [CI Workflow](#ci-workflow)
- [Known Issues](#known-issues)

## Assignment

A To-Do can be rather simple consisting of a title, description, and a list of subtasks. It can be created, changed, deleted, and toggled between completed and not completed.

The backend should be based on NodeJS and has an API that allows to manage To-Dos. Feel free to use JavaScript or TypeScript - we use TypeScript for all our NodeJS services. The way the To-Dos are stored in the backend is up to you, but the data needs to be persistent between restarts of your application.

The frontend can be very simplistic and should be based on Angular, as this is the Framework we use for the user interface of our product.

As a bonus, of course, feel free to add other things as you like that might demonstrate what is important for you when writing code & working with code or whatever the UX or product person in you thinks is valuable or a cool feature on top.

## Prerequisites

- Install [node.js version 20](https://nodejs.org/en/download/package-manager)
- Install [Docker](https://docs.docker.com/get-docker/)

## Running Todo App Locally

Run `npm install` in the repository root to install all dependencies.

In order to store todo data persistently, a MongoDB database is used. The simplest way to start a local instance is by running a Docker container with the [official MongoDB image](https://hub.docker.com/_/mongo/tags).

```
docker run -d -p 27017-27019:27017-27019 --name mongodb mongo:latest
```

The backend is implemented using the Express framework, Node.js, and TypeScript. To start the backend server, please run the command below from the root of the monorepository:

```
npm run start:backend
```

To start the frontend, which is implemented in Angular, run the command below:

```
npm run start:frontend
```

## Testing

To run unit tests for both workspaces, execute the command below:

```
npm test
```

To ensure test isolation, speed, and consistency, the mongodb-memory-server library is used to spin up an in-memory MongoDB instance.

To run integration tests for backend, execute the command below from the root:

```
npm run test:integration:backend
```

Frontend integration testing is facilitated using the Cypress testing framework. Its intuitive API makes it well-suited for real browser testing, allowing comprehensive validation of application functionality and user interactions.

To run integration tests for backend, execute the command below from the root:

```
npm run test:integration:frontend
```

## CI Workflow

This repository utilizes GitHub Actions for its Continuous Integration (CI) workflow. The CI workflow includes steps for testing, which involves running unit and integration tests to ensure code quality and functionality. Additionally, it performs code formatting checks.

## Known Issues

Currently, during the installation of dependencies, we encounter an npm warning:

```
npm warn deprecated inflight@1.0.6: This module is not supported, and leaks memory. Do not use it. Check out lru-cache if you want a good and tested way to coalesce async requests by a key value, which is much more comprehensive and powerful.
```

The outdated dependency is already adressed by [alpha version of jest](https://github.com/jestjs/jest/blob/v30.0.0-alpha.5/packages/jest-reporters/package.json#L27).

[Link to issue discussion](https://github.com/jestjs/jest/issues/15087).
