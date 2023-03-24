.PHONY: couchdb, install, dev
.DEFAULT: install

DOCKER:=$(shell which docker)

node_modules: package-lock.json
	npm install
	@touch $@

install: node_modules

couchdb:
	$(DOCKER) pull couchdb
	$(DOCKER) container inspect couchdb | grep '"Status": "running"' || $(DOCKER) start couchdb && sleep 1
	$(DOCKER) container inspect couchdb 1>/dev/null || $(DOCKER) run -d -p 5984:5984 -e COUCHDB_USER=admin -e COUCHDB_PASSWORD=password --name couchdb couchdb
	npx add-cors-to-couchdb -u admin -p password

dev: install couchdb
