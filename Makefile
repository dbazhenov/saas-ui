DOCKER_TAG ?= latest
DOCKER_IMAGE_PATH = ghcr.io/percona-platform/saas-ui/saas-ui
DOCKER_IMAGE = $(DOCKER_IMAGE_PATH):$(DOCKER_TAG)

default: help

help:                   ## Display this help message
	@echo "Please use \`make <target>\` where <target> is one of:"
	@grep '^[a-zA-Z]' $(MAKEFILE_LIST) | \
		awk -F ':.*?## ' 'NF==2 {printf "  %-26s%s\n", $$1, $$2}'

init:                   ## Install dependencies
	npm i

dev:                    ## Develop locally
	npm start

e2e:					## Run e2e tests
	npm run cy:run

test:                   ## Run unit tests
	npm run test:ci

build:                  ## Build artifacts
	npm run lint && npm run build

docker-build:           ## Build Docker image
	docker build --squash --tag $(DOCKER_IMAGE) .

docker-tag:             ## Extend the image tag only if we have latest or dev images
	@if $$(echo $(DOCKER_TAG) | grep -E "^(latest|dev)$$" >/dev/null); then \
	    docker tag $(DOCKER_IMAGE) $(DOCKER_IMAGE_PATH):$(DOCKER_TAG)-$$(git show -s --format=%cd_%h --date=format:'%Y%m%d_%H%M%S'); \
	fi;

docker-push:            ## Push Docker image
	docker push --all-tags $(DOCKER_IMAGE_PATH)
