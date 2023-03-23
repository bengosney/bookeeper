import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

import { Provider } from "use-pouchdb";
import PouchDB from "pouchdb-browser";
import PouchDBFind from "pouchdb-find";

PouchDB.plugin(PouchDBFind);

const db = new PouchDB("local");
const remoteDB = new PouchDB(`http://127.0.0.1:5984/db`, {
  auth: {
    username: "admin",
    password: "password",
  },
});
db.sync(remoteDB, { live: true, retry: true });

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

root.render(
  <React.StrictMode>
    <Provider pouchdb={db}>
      <App />
    </Provider>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
