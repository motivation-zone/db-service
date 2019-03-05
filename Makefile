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

.PHONY: lint.main
lint.main:
	$(TSLINT) -c tslint.json 'src/**/*.ts'

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
.PHONY: test.func.fill
test.func.fill:
	make build && \
	export NODE_PATH=$(OUT_DIR) && \
	export TZ=$(TZ) && \
	$(NODE) $(OUT_DIR)/tests/func/fill/index.js && \
	make clean

.PHONY: test.func
test.func:
	make build && \
	export NODE_PATH=$(OUT_DIR) && \
	export TZ=$(TZ) && \
	$(NODE) $(OUT_DIR)/tests/func/fill/index.js && \
	$(MOCHA) $(OUT_DIR)/tests/**/*.test.js --exit && \
	make clean


# Deployment
VERSION := $(shell cat ./package.json | python -c "import json,sys;obj=json.load(sys.stdin);print obj['version'];")
DOCKER_HUB := motivationzone/dbservice
.PHONY: docker.build
docker.build:
	docker build -t $(DOCKER_HUB):$(VERSION) .

.PHONY: docker.run.testing
docker.run.testing:
	docker run -d -e "ENVIRONMENT=testing" \
		-v /usr/share/motivation_zone/db/db.yaml:/usr/local/app/configs/db/db.yaml \
		-p 5000:80 $(image_id)
