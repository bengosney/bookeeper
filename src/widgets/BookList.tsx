import { useFind } from "use-pouchdb";
import { BookDoc, useBookRefresh } from "../documents/book";
import BookItem from "./BookItem";
import "./BookList.css";

type BookFields = keyof BookDoc;
const BookList = () => {
  const fieldList: BookFields[] = ["_id", "title", "authors", "cover", "isbn"];
  const refetch = useBookRefresh();

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
    <div className="books">
      {books.map((book) => (
        <BookItem key={book._id} book={book} />
      ))}
    </div>
  );
};

export default BookList;
