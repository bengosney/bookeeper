import { useEffect, useReducer, useState } from "react";
import { BaseDoc } from "./_base";

export interface Book {
  authors: string[];
  title: string;
  isbn: string;
  cover: string | null;
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

const useLookupGoogle = (code: string): LookupReturn => {
  const [state, dispatch] = useReducer((state: LookupReturn, action: Book): LookupReturn => {
    return {
      book: action,
      looking: false,
    };
  }, emptyReturn());

  useEffect(() => {
    fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${code}`)
      .then((response) => response.json())
      .then((data) => data.items[0].volumeInfo)
      .then((data: GoogleBook) => {
        dispatch({
          isbn: code,
          authors: data.authors,
          title: data.title,
          cover: data.imageLinks.thumbnail,
        });
      });
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
    cover: {
      small: string;
      medium: string;
      large: string;
    };
  };
}

const useLookupOpenLibrary = (code: string): LookupReturn => {
  const [state, dispatch] = useReducer((state: LookupReturn, action: Book): LookupReturn => {
    return {
      book: action,
      looking: false,
    };
  }, emptyReturn());

  useEffect(() => {
    fetch(`https://openlibrary.org/api/books?bibkeys=${code}&jscmd=data&format=json`)
      .then((response) => response.json())
      .then((data: OpenBook) => data[code])
      .then((data) => {
        dispatch({
          authors: data.authors.map((obj) => obj.name),
          cover: data.cover.large,
          title: data.title,
          isbn: code,
        });
      });
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
