import { useCallback, useEffect, useReducer, useState } from "react";
import { usePouch } from "use-pouchdb";
import { BaseDoc } from "./_base";

export interface Book {
  authors: string[];
  title: string;
  isbn: string;
  cover: string | undefined;
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

export const useBookRefresh = () => {
  const db = usePouch();

  return async (oldBook: BookDoc) => {
    if (!oldBook.cover) {
      try {
        await db.put({
          _id: `refresh-queue-${oldBook._id}`,
          type: "refresh-queue",
          isbn: oldBook._id,
        });
      } catch (err) {}
    }
  };
};
