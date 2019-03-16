# Precommit
We use husky & lint-staged npm packages for creating precommit checking.
Before every commit next command is run for every changed files.
```
make lint.staged
```
It checks code styles for /src and /tests folder and run functional tests.

# Environments
```
NODEJS_PORT - nodejs port
NODEJS_ENV - nodejs environment name (development | testing | stress | production)
```

# Build
```
make build - build project
make build.watch - build project with watch mode
```

# Run
```
make server.dev - run server by node-ts without creating "build" dir
make server.run - run server from "build" dir by nodejs
```

# Linting
Two different commands, because tests rules code style a little bit difference.
```
make lint.main - linting /src folder
make lint.tests - linting /tests folter
```

# Test
## Functional
```
make test.func - common command (fill && func)
make test.func.fill - clear all public schemas and create it again -> fill db by faker data
```

## Load
