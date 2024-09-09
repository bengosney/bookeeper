import { useFind } from "use-pouchdb";
import { Outlet } from "react-router-dom";
import { Book, BookDoc, useBookRefresh } from "../documents/book";
import BookItem from "./BookItem";
import "./BookList.scss";
import { useState } from "react";
import useDebounce from "../hooks/debounce";
import { PouchDocumentRev } from "../documents/types";

type BookFields = keyof PouchDocumentRev<Book>;
const BookList = () => {
  const fieldList: BookFields[] = ["_id", "_rev", "title", "authors", "cover", "isbn", "finished"];
  useBookRefresh();
  const [_search, setSearch] = useState<string>("");
  const search = useDebounce(_search, 300);

  const {
    docs: books,
    loading,
    error,
  } = useFind<BookDoc>({
    index: {
      fields: ["type", "title"],
    },
    selector: {
      type: "book",
      title: { $regex: RegExp(`.*${search}.*`, "i") },
    },
    fields: fieldList,
  });

  if (error && !loading) {
    return <div>something went wrong: {error.message}</div>;
  }

  if (books == null && loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="search-box">
        <input value={_search} onChange={(e) => setSearch(e.target.value)} placeholder={"Search..."} />
      </div>
      <div className="books">
        {books.map((book) => (
          <BookItem key={book._id} book={book} />
        ))}
      </div>
      <Outlet />
    </>
  );
};

export default BookList;
