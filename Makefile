override DOCKERFILE_LOCATION := ./dist/docker/target/docker

MEM_DOCKERFILE ?= Dockerfile.jvm
DOCKER_BUILD_WORKSPACE ?= $(DOCKERFILE_LOCATION)

IMAGE_REPO ?= quay.io
IMAGE_GROUP ?= apicurio
IMAGE_TAG ?= latest-snapshot

SKIP_TESTS ?= false
COMMON_ARGS=-Dmaven.javadoc.skip=true --no-transfer-progress -DtrimStackTrace=false
EXTRA_ARGS ?=

.DEFAULT_GOAL := help


help:
	@echo ""
	@echo "Please use \`make <target>' where <target> is one of:-"
	@grep -E '^\.PHONY: [a-zA-Z_-]+ .*?## .*$$' $(MAKEFILE_LIST)  | awk 'BEGIN {FS = "(: |##)"}; {printf "\033[36m%-42s\033[0m %s\n", $$2, $$3}'
	@echo ""
	@echo "=> EXTRA_ARGS: You can pass additional build args by overriding the value of this variable. By Default, it doesn't pass any additional flags."
	@echo ""
.PHONY: help


#dev-build:
#	mvn install -Ddev $(COMMON_ARGS) $(EXTRA_ARGS)
#.PHONY: dev-build ## Builds the simplified development version (using mocks instead of external dependencies)
#
#
#dev-run:
#	mvn install quarkus:dev -Ddev $(COMMON_ARGS) $(EXTRA_ARGS)
#.PHONY: dev-run ## Builds the simplified development version, and runs it using Quarkus dev mode


build:
	mvn install -DskipTests=$(SKIP_TESTS) $(COMMON_ARGS) $(EXTRA_ARGS)
.PHONY: build ## Builds and runs unit tests

deploy:
	mvn deploy -Pprod,release -DskipTests=$(SKIP_TESTS) $(COMMON_ARGS) $(EXTRA_ARGS)
.PHONY: deploy ## Deploys to maven central


#integration-tests:
#	mvn verify -Pit -pl integration-tests $(COMMON_ARGS) $(EXTRA_ARGS)
#.PHONY: integration-tests  ## Builds and runs integration tests


build-image:
	docker build -f $(DOCKERFILE_LOCATION)/$(MEM_DOCKERFILE) -t $(IMAGE_REPO)/$(IMAGE_GROUP)/apicurio-api-designer-mem:$(IMAGE_TAG) $(DOCKER_BUILD_WORKSPACE)
.PHONY: build-image ## Builds docker image for 'in-memory' storage variant.