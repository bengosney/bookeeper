import React from "react";
import logo from "./logo.svg";
import "./App.scss";
import { useDoc, usePouch, useFind, useAllDocs } from "use-pouchdb";
import FindThing from "./FindThing";
import { useBookLookup } from "./documents/book";
import BookList from "./widgets/BookList";

function App() {
  return (
    <div className="App">
      <BookList />
    </div>
  );
}

export default App;
