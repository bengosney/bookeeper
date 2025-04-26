import { Link, useLoaderData, Form } from "react-router-dom";
import { Book } from "../documents/book";

import "./BookDetail.scss";

const BookDetail = () => {
  const book = useLoaderData() as Book | null;

  if (!book) {
    return (
      <div className="details">
        <div>
          <div>Book not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="details">
      <div>
        <div className="info-grid">
          <div>Title: {book.title}</div>
          <div>Authors: {book.authors.join(", ")}</div>
          <div>ISBN: {book.isbn}</div>
        </div>
        <div className="buttons">
          <Form method="post" id="mark-as-read">
            <input type="hidden" id="finished" name="finished" value={book.finished ? "false" : "true"} />
            <button type="submit">{!book.finished ? "Mark as read" : "Mark as not read"}</button>
          </Form>
          <Form method="post" id="mark-as-removed">
            <input type="hidden" id="removed" name="removed" value={book.removed ? "false" : "true"} />
            <button type="submit">{!book.removed ? "Mark as removed" : "Mark as not removed"}</button>
          </Form>
          <Link to="../" className="button">
            Close
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
