# Precommit
We use husky & lint-staged npm packages for creating precommit checking.
Before every commit next command is run for every changed files.
```Makefile
make lint-staged
```
It checks code styles for /src and /tests folder and run functional tests.

# Environments
```typescript
interface env {
    NODEJS_PORT: string;
    NODEJS_ENV: 'development' | 'testing' | 'stress' | 'production'
}
```

# Build
```Makefile
make build # build project
make build-watch # build project with watch mode
```

# Run
```Makefile
make server-dev # run server by node-ts without creating "build" dir
make server-run # run server from "build" dir by nodejs
```

# Linting
Two different commands, because tests rules code style a little bit difference.
```Makefile
make lint-src # linting /src folder
make lint-tools # linting /tools folder
make lint-tests # linting /tests folder
```

# Tools
```Makefile
make tools-generate-api-doc # generate api documentation by jsdoc comments
make tools-generate-token # generate token by key from env ${MZ_DB_SERVICE_PRIVATE_KEY}
make tools-migration-concat # concat all pgsql schemas to one file
```

# Test
## Functional
```Makefile
make test-func # before tests this command fill it
make test-fill__func # clear all public schemas and create it again -> fill db by faker data
```

## Stress
For launch stress testing you should execute next commands one by one

### Steps
#### Preparing
1. Fill local database: ```make test-fill__stress```
2. Create ammo file for tank: ```make test-stress__ammo-generate```
3. Make dump of database: ```make test-stress__dump```
4. You must get tank token from yandex.tank service [SERVICES.md](./SERVICES.md) >> */tests/stress/tank-token.txt*
5. For configuring tank you can edit */tests/stress/config.yaml* config

#### Launching
1. Build container: ```make test-stress__docker-build```
2. Run container: ```make docker-run-stress-dev ARGS="image=value"```
3. Run tanker: ```make test-stress__tank-run```
5. Fire: (launch in tank) ```yandex-tank -c ./tests/stress/config.yaml ./tests/stress/ammo.txt```

#### Analising
1. See logs in ```/stress-logs``` folder
2. See on special tank service results of stress [SERVICES.md](./SERVICES.md)
