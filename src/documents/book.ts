import { useCallback, useEffect, useReducer, useState } from "react";
import { useDoc, useFind, usePouch } from "use-pouchdb";
import { BaseDoc } from "./_base";

export interface Book {
  authors: string[];
  title: string;
  isbn: string;
  cover: string | undefined;
  _attachments?: {
    "cover.png": {
      content_type: "image/png";
      data: string;
    };
  };
}

export interface BookDoc extends BaseDoc, Book {
  type: "book";
}

export interface LookupReturn {
  book: Book | undefined;
  looking: boolean;
}

interface GoogleBook {
  title: string;
  authors: string[];
  imageLinks: {
    smallThumbnail: string;
    thumbnail: string;
  };
}

export const bookToDoc = (book: Book): BookDoc => {
  return {
    ...book,
    type: "book",
    _id: book.isbn,
  };
};

const emptyReturn = (): LookupReturn => ({ book: undefined, looking: true });
const toBook = (book: Book): Book => book;

const fetchFromGoogle = (code: string): Promise<Book> => {
  return fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${code}`)
    .then((response) => response.json())
    .then((data) => data.items[0].volumeInfo)
    .then((data: GoogleBook) =>
      toBook({
        isbn: code,
        authors: data.authors,
        title: data.title,
        cover: data.imageLinks.thumbnail,
      }),
    );
};

const useLookupGoogle = (code: string): LookupReturn => {
  const [state, dispatch] = useReducer((state: LookupReturn, book: Book | undefined): LookupReturn => {
    return {
      book: book,
      looking: false,
    };
  }, emptyReturn());

  useEffect(() => {
    fetchFromGoogle(code).then(dispatch);
  }, [code]);

  return state;
};

interface OpenBook {
  [key: string]: {
    title: string;
    authors: Array<{
      name: string;
      url: string;
    }>;
    cover?: {
      small: string;
      medium: string;
      large: string;
    };
  };
}

const fetchFromOpenLibrary = (code: string): Promise<Book> => {
  return fetch(`https://openlibrary.org/api/books?bibkeys=${code}&jscmd=data&format=json`)
    .then((response) => response.json())
    .then((data: OpenBook) => data[code])
    .then((data) =>
      toBook({
        authors: data.authors.map((obj) => obj.name),
        cover: data.cover?.large || undefined,
        title: data.title,
        isbn: code,
      }),
    );
};

const useLookupOpenLibrary = (code: string): LookupReturn => {
  const [state, dispatch] = useReducer((state: LookupReturn, book: Book | undefined): LookupReturn => {
    return {
      book: book,
      looking: false,
    };
  }, emptyReturn());

  useEffect(() => {
    fetchFromOpenLibrary(code).then(dispatch);
  }, [code]);

  return state;
};

export const useBookLookup = (code: string): LookupReturn => {
  const openBook = useLookupOpenLibrary(code);
  const googleBook = useLookupGoogle(code);

  return {
    book: googleBook.book || openBook.book,
    looking: googleBook.looking && openBook.looking,
  };
};

export const fetchBook = (code: string): Promise<Book> => {
  return fetchFromGoogle(code).catch(() => fetchFromOpenLibrary(code));
};

export const useAddBook = () => {
  const db = usePouch();

  return (isbn: string) => {
    return db.get(isbn).catch((err) => {
      if (err.status == 404) {
        console.log(`looking up ${isbn}`);
        return fetchBook(isbn).then((book) => db.put(bookToDoc(book)));
      }
    });
  };
};

export const useBookRefresh = () => {
  const db = usePouch();
  const { docs, loading, error } = useFind<BookDoc>({
    selector: {
      type: "book",
      cover: { $exists: false },
    },
  });
  const [lookups, setLookups] = useState(0);
  const addLookup = () => setLookups((lookups) => lookups + 1);

  useEffect(() => {
    if (docs.length) {
      const interval = setInterval(() => {
        const doc = docs[Math.floor(Math.random() * docs.length)];
        addLookup();
        fetchBook(doc._id).then((remoteBook) => {
          db.get<BookDoc>(remoteBook.isbn).then((book) => {
            book.cover = remoteBook.cover;
            db.put(book);
          });
        });

        if (lookups > docs.length * 2) {
          clearInterval(interval);
        }
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [docs]);
};

// Failed attempt at storing covers, can't download them because of CORS :(
export const Cover = ({ id }: { id: string }) => {
  const db = usePouch();
  const { doc: book } = useDoc<BookDoc>(id);
  const [image, setImage] = useState<Blob | null>(null);

  const coverImageName = "cover.png";

  useEffect(() => {
    if (book) {
      db.getAttachment(book._id, coverImageName)
        .then((data) => {
          if ("size" in data && data.size > 0) {
            return db.removeAttachment(book._id, coverImageName, book._rev);
          } else {
          }
        })
        .catch((err) => {
          if (err.name == "not_found" && book.cover) {
            fetch(book.cover)
              .then((response) => response.blob())
              .then((blob) => {
                if (blob.size > 0) {
                  return db.putAttachment(book._id, coverImageName, book._rev, blob, blob.type);
                }
              })
              .catch((err) => console.log("Fetch error", err));
          } else {
            console.log("err?", err);
          }
        });
    }
  }, [book]);

  return null;
};
