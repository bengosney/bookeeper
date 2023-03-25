import { useEffect, useState } from "react";
import { usePouch } from "use-pouchdb";
import { Book as BookDoc, bookToDoc } from "./documents/book";

interface BooksAPI {
  count: number;
  next: string;
  previous: null;
  results: Book[];
}

interface Book {
  id: number;
  publish_date: string;
  title: string;
  isbn: string;
  last_updated: Date;
  created: Date;
  authors: Author[];
  tmp_cover: null | string;
}

interface Author {
  id: number;
  name: string;
}

interface AuthResponse {
  access: string;
  refresh: string;
}

export const useImport = (username: string, password: string) => {
  const baseURL = "https://api.isitbinday.com";
  const [token, setToken] = useState<string | null>(null);
  const [url, setUrl] = useState<string>(`${baseURL}/api/books/book/`);
  const [importing, setImporting] = useState<boolean>(true);
  const db = usePouch();

  const convert = (book: Book): BookDoc => {
    return {
      title: book.title,
      authors: book.authors.map((a) => a.name),
      isbn: book.isbn,
      cover: book.tmp_cover || undefined,
    };
  };

  useEffect(() => {
    if (token === null) {
      fetch(`${baseURL}/api/token/`, {
        method: "post",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })
        .then((result) => result.json())
        .then((data: AuthResponse) => setToken(data.access));
    }
  }, [username, password, token]);

  useEffect(() => {
    if (token) {
      fetch(url, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((result) => result.json())
        .then((data: BooksAPI) => {
          console.log("api data:", data);
          db.bulkDocs(data.results.map(convert).map(bookToDoc)).then(() => {
            if (data.next) {
              setUrl(data.next.replace("http:", "https:"));
            } else {
              setImporting(false);
            }
          });
        });
    }
  }, [token, url]);

  return importing;
};
