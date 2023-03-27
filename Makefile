.PHONY: couchdb, install, dev
.DEFAULT: install

DOCKER:=$(shell which docker)

node_modules: package-lock.json
	npm install
	@touch $@

install: node_modules

couchdb:
	$(DOCKER) pull couchdb
	$(DOCKER) container inspect couchdb | grep '"Status": "running"' || $(DOCKER) start couchdb || true
	$(DOCKER) container inspect couchdb 1>/dev/null || $(DOCKER) run -d -p 5984:5984 -e COUCHDB_USER=admin -e COUCHDB_PASSWORD=password --name couchdb couchdb
	sleep 1
	npx add-cors-to-couchdb -u admin -p password

dev: install couchdb

cors:
	npx add-cors-to-couchdb -u bengosney@googlemail.com -p JiykBHeh.FVZT3t https://300c058f-1ab1-4a2a-b87b-09f5ed8cdbd0-bluemix.cloudantnosqldb.appdomain.cloud
