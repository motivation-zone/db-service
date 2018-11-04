OUT_DIR := build
NODE ?= node
NPM ?= npm

build = node_modules/.bin/tsc --outDir $(OUT_DIR) --rootDir $(CURDIR) $(1)

.PHONY: install
install:
	$(NPM) install

.PHONY: prune
prune:
	$(NPM) prune --production

.PHONY: build
build:
	$(call build)

.PHONY: build-watch
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
