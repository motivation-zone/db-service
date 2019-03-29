# Docker

## Deployment
For deploing project we use docker.

| Environment | Command |
|---|---|
| Testing | node deploy/deploy-testing.js |
| Production | node deploy/deploy-production.js |

```Important: u have to ssh connect to host without password requiring!!!```

## Steps
Don't forget to check version

1. make docker.build
2. make docker.login
3. make docker.push
4. make deploy.testing or make deploy.production

## Commands

### make docker.build
```
Create image of docker container with project and use tag: docker_hub:version.
Version get from package.json
```

### make docker.login
```
Username and password must be in environment: MZ_DB_SERVICE_DOCKER_USER and MZ_DB_SERVICE_DOCKER_PASS.
```

### make docker.push
```
Push tagged image to the docker hub repository.
```

### make docker.pull
```
Pull tagged image.
```

### make docker.run.local
```
Command for running docker container on local machine.
```

### make docker.run.testing
```
Command for running docker container on remote server in testing environment.
```
