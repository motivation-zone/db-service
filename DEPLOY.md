# Docker

## Commands

### make docker.build
Create image of docker container with project and use tag: docker_hub:version.
Version get from package.json

### make docker.push
Push tagged image to the docker hub repository.
Before it u must to be logged in.
Username and password must be in environment: MZ_DB_SERVICE_DOCKER_USER and MZ_DB_SERVICE_DOCKER_PASS.

### make docker.run.local
Command for running docker container on local machine.

### make docker.run.testing
Command for running docker container on remote server in testing environment.
