TSNODE = node_modules/.bin/ts-node
MAKEFILE = $(TSNODE) -r tsconfig-paths/register --files=true Makefile.ts $(1)

# Build
deps:
	npm install

prune:
	$(call MAKEFILE,prune)

.PHONY: build
build:
	$(call MAKEFILE,build)

build-watch:
	$(call MAKEFILE,build-watch)

clean-build:
	$(call MAKEFILE,clean-build)

# Linting
lint-staged:
	$(call MAKEFILE,lint-staged)

lint-src:
	$(call MAKEFILE,lint-src)

lint-tools:
	$(call MAKEFILE,lint-tools)

lint-tests:
	$(call MAKEFILE,lint-tests)

# Server
server-dev:
	$(call MAKEFILE,server-dev)

server-run:
	$(call MAKEFILE,server-run)

# Tests
test-fill:
	$(call MAKEFILE,test-fill)

test-fill__func:
	$(call MAKEFILE,test-fill__func)

test-fill__stress:
	$(call MAKEFILE,test-fill__stress)

test-func:
	$(call MAKEFILE,test-func)

# test-stress:
# 	$(call MAKEFILE,test-func)

# test-stress__docker-build:
# 	$(call MAKEFILE,test-stress__docker-build)

# test-stress__tank-run:
# 	$(call MAKEFILE,test-stress__tank-run)

# test-stress__ammo-generate:
# 	$(call MAKEFILE,test-stress__ammo-generate)

# test-stress__get-ammo:
# 	$(call MAKEFILE,test-stress__get-ammo)

# test-stress__get-query-errors:
# 	$(call MAKEFILE,test-stress__get-query-errors)

# test-stress__fire:
# 	$(call MAKEFILE,test-stress__fire)

# Tools
tools-generate-api-doc:
	$(call MAKEFILE,tools-generate-api-doc)

tools-generate-token:
	$(call MAKEFILE,tools-generate-token)

tools-migration-concat:
	$(call MAKEFILE,tools-migration-concat)

# Docker
docker-build:
	$(call MAKEFILE,docker-build)

# docker-login:
# 	$(call MAKEFILE,docker-login)

# docker-push:
# 	$(call MAKEFILE,docker-push)

# docker-pull:
# 	$(call MAKEFILE,docker-pull)

# docker-run:
# 	$(call MAKEFILE,docker-run)

# docker-run-dev:
# 	$(call MAKEFILE,docker-run-dev)

# docker-run-testing:
# 	$(call MAKEFILE,docker-run-testing)

# docker-run-production:
# 	$(call MAKEFILE,docker-run-production)

# docker-run-stress-dev:
# 	$(call MAKEFILE,docker-run-stress-dev)

# # Deployment
# deploy-testing:
# 	$(call MAKEFILE,deploy-testing)

# deploy-production:
# 	$(call MAKEFILE,deploy-production)
