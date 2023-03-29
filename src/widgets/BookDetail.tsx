import { Link, useLoaderData, Form } from "react-router-dom";
import { Book } from "../documents/book";

import "./BookDetail.scss";

const BookDetail = () => {
  const book = useLoaderData() as Book | null;

  if (!book) {
    return <div>Book not found</div>;
  }

  return (
    <div className="details">
      <div>
        <div>Title: {book.title}</div>
        <div>Authors: {book.authors.join(", ")}</div>
        <div>ISBN: {book.isbn}</div>
        <hr />
        <Form method="post">
          <input type="hidden" id="finished" name="finished" value={book.finished ? "false" : "true"} />
          <button type="submit">{!book.finished ? "Mark as read" : "Mark as not read"}</button>
        </Form>
        <Link to="../">Close</Link>
      </div>
    </div>
  );
};

export default BookDetail;
