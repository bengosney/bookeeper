import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

import { Provider } from "use-pouchdb";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import PouchDB from "pouchdb-browser";
import PouchDBFind from "pouchdb-find";
import PouchUpsert from "pouchdb-upsert";
import BookList from "./widgets/BookList";
import Settings from "./Settings";
import Scanner from "./Scanner";
import BookDetail from "./widgets/BookDetail";

import * as serviceWorkerRegistration from "./serviceWorkerRegistration";

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
        children: [
          {
            path: "scan",
            element: <Scanner on={true} modal={true} />,
          },
          {
            path: ":book_id",
            element: <BookDetail />,
            loader: async ({ params }) => {
              return params.book_id ? await db.get(params.book_id) : null;
            },
            action: async ({ request, params }) => {
              const formData = await request.formData();
              const { finished = undefined } = Object.fromEntries(formData);

              if (!params.book_id || !finished) {
                return null;
              }
              return db.upsert(params.book_id, (doc) => {
                return { ...doc, finished: finished == "true" ? true : false };
              });
            },
          },
        ],
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

serviceWorkerRegistration.register();
