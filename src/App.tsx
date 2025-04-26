import "./App.scss";
import { useAllDocs } from "use-pouchdb";
import { Outlet, Link, useLocation } from "react-router-dom";
import usePouchSync from "./hooks/pouchSync";
import { Number } from "./widgets/Number";

function App() {
  usePouchSync();
  const location = useLocation();

  const isBasePath: boolean = location.pathname === "/";
  const { total_rows: docCount } = useAllDocs({ include_docs: false });

  return (
    <div className="App">
      <header>
        <h1>Bookkeeper</h1>
        <nav>
          <Link to={"/"}>Home</Link>
          <Link to={"/books/"}>Book Shelf</Link>
          <Link to={"/books/scan"}>Scanner</Link>
          <Link to={"/books/add"}>Add ISBN</Link>
          <Link to={"/settings/"}>Settings</Link>
        </nav>
      </header>
      <Outlet />
      {isBasePath && (
        <div className="dashboard">
          <p>Welcome to the Bookkeeper app!</p>
          <p>
            <Number value={docCount} /> books tracked
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
