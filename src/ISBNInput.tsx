import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAddBook } from "./documents/book";

import "./ISBNInput.scss";

interface ISBNInputProps {
    modal?: boolean;
}

const ISBNInput = ({ modal = true }: ISBNInputProps) => {
    const addBook = useAddBook();
    const [isbn, setIsbn] = useState("");
    const navigate = useNavigate();

    const classes = ["isbn-input"];
    if (modal) {
        classes.push("modal");
    }

    return (
        <div className={classes.join(" ")}>
            <div>
                <input autoFocus value={isbn} onChange={(e) => setIsbn(e.target.value)} placeholder="Enter ISBN" />
                <button disabled={isbn == ""} onClick={() => {
                    if (isbn) {
                        addBook(isbn).then(() => navigate("../"));
                    }
                }}>Add</button>
                <div>
                    <Link to="../">Close</Link>
                </div>
            </div>
        </div>
    );
};

export default ISBNInput;
