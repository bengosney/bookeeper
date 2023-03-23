import { useEffect, useState } from "react";

export interface Book {
  authors: string[];
  title: string;
  isbn: string;
  cover: string;
}

interface GoogleBook {
  title: string;
  authors: string[];
  imageLinks: {
    smallThumbnail: string;
    thumbnail: string;
  };
}

const useLookupGoogle = (code: string) => {
  const [book, setBook] = useState<Book | undefined>();
  useEffect(() => {
    fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${code}`)
      .then((response) => response.json())
      .then((data) => data.items[0].volumeInfo)
      .then((data: GoogleBook) => {
        setBook({
          isbn: code,
          authors: data.authors,
          title: data.title,
          cover: data.imageLinks.thumbnail,
        });
      });
  }, [code]);

  return book;
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

const useLookupOpenLibrary = (code: string) => {
  const [book, setBook] = useState<Book | undefined>();
  useEffect(() => {
    fetch(`https://openlibrary.org/api/books?bibkeys=${code}&jscmd=data&format=json`)
      .then((response) => response.json())
      .then((data: OpenBook) => data[code])
      .then((data) => {
        setBook({
          authors: data.authors.map((obj) => obj.name),
          cover: data.cover.large,
          title: data.title,
          isbn: code,
        });
      });
  }, [code]);

  return book;
};

export const useBookLookup = async (code: string) => {
  console.log("lookup");
  useLookupOpenLibrary(code);
  return useLookupGoogle(code);
};
