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

# Linting
Two different commands, because tests rules code style a little bit difference.
```
make lint.main - linting /src folder
make lint.tests - linting /tests folter
```

# Test
## Functional
```
make test - common command (fill && func)
make test.fill - clear all public schemas and create it again
make test.func - run functional tests
```

## Load
