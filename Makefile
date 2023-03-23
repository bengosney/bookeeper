.PHONY: couchdb

couchdb:
	docker run -d -p 5984:5984 -e COUCHDB_USER=admin -e COUCHDB_PASSWORD=password --name couchdb couchdb
	add-cors-to-couchdb -u admin -p password
