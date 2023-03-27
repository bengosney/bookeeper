import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

import { Provider } from "use-pouchdb";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import PouchDB from "pouchdb-browser";
import PouchDBFind from "pouchdb-find";
import PouchUpsert from "pouchdb-upsert";
import BookList from "./widgets/BookList";
import Settings from "./Settings";

PouchDB.plugin(PouchDBFind);
PouchDB.plugin(PouchUpsert);

const db = new PouchDB("bookeeper", { auto_compaction: true });

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "books",
        element: <BookList />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

root.render(
  <React.StrictMode>
    <Provider pouchdb={db}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
