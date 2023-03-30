import { useFind } from "use-pouchdb";
import { Outlet } from "react-router-dom";
import { BookDoc, Cover, useBookRefresh } from "../documents/book";
import BookItem from "./BookItem";
import "./BookList.scss";
import { useState } from "react";
import useDebounce from "../hooks/debounce";

type BookFields = keyof BookDoc;
const BookList = () => {
  const fieldList: BookFields[] = ["_id", "title", "authors", "cover", "isbn", "finished"];
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
