OUT_DIR := build
NODE ?= node
NPM ?= npm

build = node_modules/.bin/tsc $(1)

# Build
.PHONY: install
install:
	$(NPM) install --no-save

.PHONY: prune
prune:
	$(NPM) prune --production

.PHONY: build
build:
	$(call build)

.PHONY: build.watch
build.watch:
	$(call build,--watch)

.PHONY: clean
clean:
	rm -rf $(OUT_DIR)

# Linting
.PHONY: lint.staged
lint.staged:
	node_modules/.bin/lint-staged -c .lintstagedrc.json

.PHONY: lint.main
lint.main:
	node_modules/.bin/tslint -c tslint.json 'src/**/*.ts'

.PHONY: lint.tests
lint.tests:
	node_modules/.bin/tslint -c tslint.tests.json 'tests/**/*.ts'

# Run the application in development mode
.PHONY: dev
dev:
	DEBUG=dbservice:* \
	NODE_PATH=$(OUT_DIR) \
	TZ=UTC \
	node_modules/.bin/supervisor \
		--non-interactive \
		--quiet \
		--no-restart-on exit \
		--watch $(OUT_DIR)/configs,$(OUT_DIR)/src \
		-- $(OUT_DIR)/src/app.js

# Tests
.PHONY: test.fill
test.fill:
	NODE_PATH=$(OUT_DIR) \
	DEBUG=dbservice:* \
	node build/tests/fill/index.js

.PHONY: test.func
test.func:
	NODE_PATH=$(OUT_DIR) \
	DEBUG=dbservice:* \
	node_modules/.bin/mocha build/tests/**/*.test.js --exit

.PHONY: test
test:
	make test.fill && make test.func

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
