import "./App.scss";
import { Outlet, Link } from "react-router-dom";
import usePouchSync from "./hooks/pouchSync";

function App() {
  usePouchSync();
  return (
    <div className="App">
      <header>
        <h1>Bookeeper</h1>
        <nav>
          <Link to={"/"}>Home</Link>
          <Link to={"/books/"}>Book Shelf</Link>
          <Link to={"/books/scan"}>Scanner</Link>
          <Link to={"/settings/"}>Settings</Link>
        </nav>
      </header>
      <Outlet />
    </div>
  );
}

export default App;
