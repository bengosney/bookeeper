import { useFind } from "use-pouchdb";
import { Outlet, Link } from "react-router-dom";
import { BookDoc, Cover, useBookRefresh } from "../documents/book";
import BookItem from "./BookItem";
import "./BookList.scss";

type BookFields = keyof BookDoc;
const BookList = () => {
  const fieldList: BookFields[] = ["_id", "title", "authors", "cover", "isbn"];
  useBookRefresh();

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
      title: { $exists: true },
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
    <div>
      <Outlet />
      <div className="books">
        {books.map((book) => (
          <BookItem key={book._id} book={book} />
        ))}
      </div>
    </div>
  );
};

export default BookList;
