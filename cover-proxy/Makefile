.PHONY: couchdb, install, dev
.DEFAULT: build

DOCKER:=$(shell which docker)
DOCKER_IMAGE_NAME:=${DOCKER_IMAGE_NAME}

build: Dockerfile proxy.conf
	$(DOCKER) build -t $(DOCKER_IMAGE_NAME):latest .

push: build
	$(DOCKER) push $(DOCKER_IMAGE_NAME)

run: build
	$(DOCKER) run --rm -p 9000:80 $(DOCKER_IMAGE_NAME):latest
