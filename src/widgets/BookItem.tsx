import { BookDoc } from "../documents/book";
import "./BookItem.css";

interface BookItemProps {
  book: BookDoc;
}

const BookCover = ({ book }: BookItemProps) => {
  if (book.cover) {
    return <img src={book.cover} loading="lazy" />;
  } else {
    return <div className="cover">{book.title}</div>;
  }
};

const BookItem = ({ book }: BookItemProps) => {
  return (
    <div className="book">
      <BookCover book={book} />
      <div>{book.title}</div>
      <small>ISBN: {book.isbn}</small>
    </div>
  );
};

export default BookItem;
