OUT_DIR := build
NODE ?= node
NPM ?= npm

build = node_modules/.bin/tsc --outDir $(OUT_DIR) --rootDir $(CURDIR) $(1)

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

.PHONY: lint
lint:
	node_modules/.bin/tslint -p tsconfig.json -t codeFrame $(if $(FIX),--fix)

# Run the application in development mode
.PHONY: dev
dev:
	DEBUG=dbservice:* \
	TZ=UTC \
	node_modules/.bin/supervisor \
		--non-interactive \
		--quiet \
		--no-restart-on exit \
		--watch $(OUT_DIR)/configs,$(OUT_DIR)/src \
		-- $(OUT_DIR)/src/app.js


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

.PHONY: test.fill
test.fill:
	node build/tests/fill/fill.js

.PHONY: test.func
test.func:
	node_modules/.bin/mocha build/tests/**/*.test.js --exit
