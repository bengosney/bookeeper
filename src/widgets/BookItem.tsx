import { Link } from "react-router-dom";
import { Book, useCover } from "../documents/book";
import "./BookItem.scss";
import { PouchDocumentRev } from "../documents/types";

interface BookItemProps {
  book: PouchDocumentRev<Book>;
}

const BookCover = ({ book }: BookItemProps) => {
  const alt = `${book.title} - ${book.authors.join(", ")}`;
  const cover = useCover(book);
  if (cover) {
    return <img alt={alt} src={URL.createObjectURL(cover)} loading="lazy" />;
  }

  if (book.cover) {
    return <img alt={alt} src={book.cover.replace(/^http(s)?:/, "")} loading="lazy" />;
  }

  return (
    <span className="default">
      <span className="authors">{book.authors.join(", ")}</span>
      <span className="title">{book.title}</span>
    </span>
  );
};

const BookItem = ({ book }: BookItemProps) => {
  const classes = ["book"];

  if (book.finished) {
    classes.push("finished");
  }

  return (
    <div className={classes.join(" ")}>
      <Link to={book._id} className="cover">
        <BookCover book={book} />
      </Link>
    </div>
  );
};

export default BookItem;
