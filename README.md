# Bookkeeper

Bookkeeper is a React-based web application for managing and tracking your book collection. It uses PouchDB and CouchDB for data synchronization and provides features like barcode scanning, ISBN lookup, and offline support.

## Features

- **Book Management**: Add, edit, and remove books from your collection.
- **Barcode Scanning**: Use your device's camera to scan book barcodes.
- **ISBN Lookup**: Automatically fetch book details using Google Books and Open Library APIs.
- **Offline Support**: Works offline with PouchDB and syncs with CouchDB when online.
- **Settings Management**: Configure CouchDB sync settings with QR code support.
- **Responsive Design**: Optimized for both desktop and mobile devices.


## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or later)
- [npm](https://www.npmjs.com/) (v8 or later)
- [Docker](https://www.docker.com/) (optional, for CouchDB)

### Installation

1. Clone the repository:
```sh
git clone https://github.com/your-username/bookkeeper.git
cd bookkeeper
```

2. Install dependencies:
```sh
npm install
```

3. Start a local CouchDB instance (optional):
```sh
make couchdb
```

### Running the App
Start the development server:
```sh
npm start
```
Open http://localhost:3000 in your browser.

### Building for Production
```sh
npm run build
```

This will build the static files nessassry, there is no backend service needed, just something to serve the static files.


## License
This project is licensed under the GNU General Public License v3.0.
