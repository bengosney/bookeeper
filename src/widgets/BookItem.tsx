import { BookDoc } from "../documents/book";
import "./BookItem.scss";

interface BookItemProps {
  book: BookDoc;
}

const BookCover = ({ book }: BookItemProps) => {
  if (book.cover) {
    return <img src={book.cover} loading="lazy" />;
  }
  return (
    <span className="default">
      <span className="authors">{book.authors.join(", ")}</span>
      <span className="title">{book.title}</span>
    </span>
  );
};

const BookItem = ({ book }: BookItemProps) => {
  return (
    <div className="book">
      <div className="cover">
        <BookCover book={book} />
      </div>
    </div>
  );
};

export default BookItem;
