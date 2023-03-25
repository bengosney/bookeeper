import { BookDoc } from "../documents/book";
import "./BookItem.css";

interface BookItemProps {
  book: BookDoc;
}

const BookItem = ({ book }: BookItemProps) => {
  return (
    <div className="book">
      <img src={book.cover} />
      <div>{book.title}</div>
    </div>
  );
};

export default BookItem;
