import { Link } from "react-router-dom";
import { BookDoc } from "../documents/book";
import "./BookItem.scss";

interface BookItemProps {
  book: BookDoc;
}

const BookCover = ({ book }: BookItemProps) => {
  if (book.cover) {
    return (
      <img
        alt={`${book.title} - ${book.authors.join(", ")}`}
        src={book.cover.replace(/^http(s)?:/, "")}
        loading="lazy"
      />
    );
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
