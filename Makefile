OUT_DIR := build
NODE ?= node
NPM ?= npm

BUILD = node_modules/.bin/tsc $(1)
MOCHA = node_modules/.bin/mocha
TSLINT = node_modules/.bin/tslint
LINT_STAGED = node_modules/.bin/lint-staged
NODEMON = node_modules/.bin/nodemon
TSNODE = node_modules/.bin/ts-node

DEBUG = dbservice:*
TZ = UTC

# Build
.PHONY: deps
deps:
	$(NPM) install

.PHONY: prune
prune:
	$(NPM) prune --production

.PHONY: build
build:
	$(call BUILD)

.PHONY: build.watch
build.watch:
	$(call BUILD,--watch)

.PHONY: clean
clean:
	rm -rf $(OUT_DIR)

# Linting
.PHONY: lint.staged
lint.staged:
	$(LINT_STAGED) -c .lintstagedrc.json

.PHONY: lint.src
lint.src:
	$(TSLINT) -c tslint.json 'src/**/*.ts'

.PHONY: lint.tools
lint.tools:
	$(TSLINT) -c tslint.json 'tools/**/*.ts'

.PHONY: lint.tests
lint.tests:
	$(TSLINT) -c tslint.tests.json 'tests/**/*.ts'

# Server
.PHONY: server.dev
server.dev:
	$(NODEMON) --exec "export DEBUG=$(DEBUG) && $(TSNODE) -r tsconfig-paths/register src/app.ts" -w src -w configs -e "ts"

.PHONY: server.run
server.run:
	DEBUG=$(DEBUG) \
	NODE_PATH=$(OUT_DIR) \
	TZ=$(TZ) \
	$(NODE) $(OUT_DIR)/src/app.js

# Tests
.PHONY: func-test.fill
func-test.fill:
	make build && \
	export TEST_TYPE="functional" && \
	make test.fill && \
	make clean

.PHONY: func-test
func-test:
	make build && \
	export MZ_DB_SERVICE_PRIVATE_KEY=${MZ_DB_SERVICE_PRIVATE_KEY} && \
	export MZ_DB_SERVICE_TOKEN=${MZ_DB_SERVICE_TOKEN} && \
	export DEBUG=dbservice:tests && \
	export NODE_PATH=$(OUT_DIR) && \
	export TZ=$(TZ) && \
	$(NODE) $(OUT_DIR)/tests/fill/index.js && \
	$(MOCHA) $(OUT_DIR)/tests/**/*.test.js --exit && \
	make clean

.PHONY: test.fill
test.fill:
	export MZ_DB_SERVICE_PRIVATE_KEY=${MZ_DB_SERVICE_PRIVATE_KEY} && \
	export MZ_DB_SERVICE_TOKEN=${MZ_DB_SERVICE_TOKEN} && \
	export DEBUG=dbservice:tests && \
	export NODE_PATH=$(OUT_DIR) && \
	export TZ=$(TZ) && \
	$(NODE) $(OUT_DIR)/tests/fill/index.js

.PHONY: stress-test.fill
stress-test.fill:
	make build && \
	export TEST_TYPE="stress" && \
	make test.fill && \
	make clean

.PHONY: stress-test.docker.build
stress-test.docker.build:
	docker build -f Dockerfile.stress .

.PHONY: stress-test.docker.fill
stress-test.docker.fill:
	export TEST_TYPE="stress" && \
	make test.fill

.PHONY: stress-test.tank.run
stress-test.tank.run:
	docker run \
    	-v $(PWD):/var/loadtest \
    	-v $(SSH_AUTH_SOCK):/ssh-agent \
		-e SSH_AUTH_SOCK=/ssh-agent \
    	--net host \
    	-it \
    	--entrypoint /bin/bash \
    	direvius/yandex-tank

.PHONY: stress-test.generate.ammo
stress-test.generate.ammo:
	$(TSNODE) -r tsconfig-paths/register tests/stress/ammo-generator.ts

.PHONY: stress-test.get.ammo
stress-test.get.ammo:
	rm -rf tests/stress/ammo.txt
	curl "localhost:5000/ammo.txt" >> tests/stress/ammo.txt

.PHONY: stress-test.fire
stress-test.fire:
	yandex-tank -c tests/stress/config.yaml tests/stress/ammo.txt

.PHONY: remote.fill
remote.fill:
	export IS_REMOTE=true && make test.func.fill

# Tools
.PHONY: api.doc
api.doc:
	$(TSNODE) -r tsconfig-paths/register tools/api-generator/generate.ts

.PHONY: generate.token
generate.token:
	$(TSNODE) -r tsconfig-paths/register tools/generate-token.ts

.PHONY: migration.concat
migration.concat:
	$(NODE) tools/database/pgsql-concat.js

# Deployment
PWD = $(shell pwd)
VERSION := $(shell cat ./package.json | python -c "import json,sys;obj=json.load(sys.stdin);print obj['version'];")
DOCKER_HUB := motivationzone/dbservice
DOCKER_TAG := $(DOCKER_HUB):$(VERSION)
DOCKER_NAME := mz-db-service
.PHONY: docker.build
docker.build:
	docker build -t $(DOCKER_TAG) .

.PHONY: docker.login
docker.login:
	docker login -u $(MZ_DB_SERVICE_DOCKER_USER) -p $(MZ_DB_SERVICE_DOCKER_PASS)

.PHONY: docker.push
docker.push:
	docker push $(DOCKER_TAG)

.PHONY: docker.pull
docker.pull:
	docker pull $(DOCKER_TAG)

.PHONY: docker.run.dev
docker.run.dev:
	docker run -it \
		-e "NODEJS_ENV=testing" \
		-e "MZ_DB_SERVICE_PRIVATE_KEY=${MZ_DB_SERVICE_PRIVATE_KEY}" \
		-e "MZ_DB_SERVICE_TOKEN=${MZ_DB_SERVICE_TOKEN}" \
		-v $(PWD)/configs/db/db.yaml:/usr/local/app/configs/db/db.yaml \
		-p 5000:80 $(image_id)

.PHONY: docker.run.testing
docker.run.testing:
	export NODEJS_ENV=testing && make docker.run

.PHONY: docker.run.production
docker.run.production:
	export NODEJS_ENV=production && make docker.run

.PHONY: docker.run
docker.run:
	docker run -d \
		-e "NODEJS_ENV=$(NODEJS_ENV)" \
		-e "MZ_DB_SERVICE_PRIVATE_KEY=${MZ_DB_SERVICE_PRIVATE_KEY}" \
		--name $(DOCKER_NAME) \
		-v /usr/share/motivation-zone/db/db.yaml:/usr/local/app/configs/db/db.yaml \
		-p 5000:80 $(image_id)

.PHONY: deploy.testing
deploy.testing:
	$(NODE) deploy/deploy-testing.js

.PHONY: deploy.production
deploy.production:
	$(NODE) deploy/deploy-production.js
