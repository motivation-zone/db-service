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

.PHONY: db.make.config
db.make.config:
	# TODO create symlink from server special path to configs/db/db.yaml
	# I think we need to create special folder like (usr/share/motivation_zone)
	# to save different special files there


VERSION := $(shell cat ./package.json | python -c "import json,sys;obj=json.load(sys.stdin);print obj['version'];")
DOCKER_HUB := motivationzone/dbservice
.PHONY: docker.build
docker.build:
	docker build -t $(DOCKER_HUB):$(VERSION) .

.PHONY: docker.push
docker.push:
	docker login -u=$(MZ_DB_SERVICE_DOCKER_USER) -p=$(MZ_DB_SERVICE_DOCKER_PASS) && \
	docker push $(DOCKER_HUB)

.PHONY: docker.pull
docker.pull:
	docker login -u=$(MZ_DB_SERVICE_DOCKER_USER) -p=$(MZ_DB_SERVICE_DOCKER_PASS) && \
	docker pull $(DOCKER_HUB)

.PHONY: docker.run
docker.run:
	docker run -d -p 127.0.0.1:80:80

