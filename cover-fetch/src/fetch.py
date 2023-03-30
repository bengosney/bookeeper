import couchdb
import requests

# Connect to CouchDB
server = couchdb.Server("http://admin:password@localhost:5984/")
db = server["db"]


view = db.view(
    "_all_docs",
    include_docs=True,
    # define filter function for view
    map_fun="function(doc) {if (doc._attachments == undefined) {emit(doc._id, doc);}}",  # noqa
)

for row in view:
    try:
        cover = row.doc["cover"]
    except KeyError:
        continue

    print(f"Fetching {row.doc['cover']} for {row.doc['_id']}")
    response = requests.get(row.doc["cover"])

    if response.status_code == 200:
        image_data = response.content
        db.put_attachment(
            row.doc, image_data, "cover.jpg", response.headers["Content-Type"]
        )
    else:
        print("Error fetching image:", response.status_code)
