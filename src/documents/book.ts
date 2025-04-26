import { useEffect, useReducer, useState } from "react";
import { useFind, usePouch } from "use-pouchdb";

export interface Book {
  authors: string[];
  title: string;
  isbn: string;
  cover: string | undefined;
  finished?: boolean;
  removed?: boolean;
  _attachments?: {
    [key: string]: {
      content_type: string;
      data: string;
    };
  };
}

type PouchDocument<T extends {}> = T & PouchDB.Core.IdMeta & PouchDB.Core.GetMeta;

export interface BookDoc extends Omit<PouchDocument<Book>, "_rev"> {
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

interface GoogleBookResponse {
  items: { volumeInfo: GoogleBook }[];
  [key: string]: any;
}

export const bookToDoc = (book: Book): BookDoc => {
  return {
    ...book,
    type: "book",
    _id: book.isbn,
  };
};

const emptyReturn = (): LookupReturn => ({ book: undefined, looking: true });

const fetchFromGoogle = async (code: string): Promise<Book> => {
  const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${code}`);
  const data = (await response.json()) as GoogleBookResponse;
  const { volumeInfo } = data.items[0];
  return {
    isbn: code,
    authors: volumeInfo.authors,
    title: volumeInfo.title,
    cover: volumeInfo.imageLinks.thumbnail,
  } satisfies Book;
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
}
interface OpenBookResponse {
  [MediaKeySystemAccess: string]: OpenBook;
}

const fetchFromOpenLibrary = async (code: string): Promise<Book> => {
  const response = await fetch(`https://openlibrary.org/api/books?bibkeys=${code}&jscmd=data&format=json`);
  const json_response = (await response.json()) as OpenBookResponse;
  const data = json_response[code];
  return {
    authors: data.authors.map((obj: any) => obj.name),
    cover: data.cover?.large || undefined,
    title: data.title,
    isbn: code,
  } satisfies Book;
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

export const fetchBook = async (code: string): Promise<Book> => {
  try {
    return await fetchFromGoogle(code);
  } catch {
    return await fetchFromOpenLibrary(code);
  }
};

export const useAddBook = (): ((isbn: string) => Promise<PouchDocument<Book>>) => {
  const db = usePouch();

  return async (isbn: string): Promise<PouchDocument<Book>> => {
    try {
      return await db.get<Book>(isbn);
    } catch (err) {
      if ((err as any).status === 404) {
        console.log(`looking up ${isbn}`);
        const book = await fetchBook(isbn);
        const meta = await db.put<Book>(bookToDoc(book));
        return { _id: meta.id, _rev: meta.rev, ...book };
      }
      throw err;
    }
  };
};

export const useBookRefresh = () => {
  const db = usePouch();
  const { docs } = useFind<BookDoc>({
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
  }, [db, docs, lookups]);
};
