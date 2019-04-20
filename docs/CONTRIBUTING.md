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
make lint.src - linting /src folder
make lint.tools - linting /tools folder
make lint.tests - linting /tests folter
```

# Tools
```
make api.doc - generate api documentation by jsdoc comments
make generate.token - generate token by key from env ${MZ_DB_SERVICE_PRIVATE_KEY}
```

# Test
## Functional
```
make func-test - common command (fill && func)
make func-test.fill - clear all public schemas and create it again -> fill db by faker data
```

## Stress
### Steps
1. Build container: ```make stress-test.docker.build```
2. Run container: ```make docker.run.stress```
3. Get generated ammo: ```make stress-test.get.ammo```
4. Run tanker: ```make stress-test.tank.run```
5. Fire: ```make stress-test.fire```

Get query-error log ```make stress-test.get.query-error```

```
make stress-test.fill - fill database in stress mode
make stress-test.docker.build - command for build docker container for stress
make stress-test.docker.fill - command for filling database in docker container for stress
make stress-test - launch stress test
```
