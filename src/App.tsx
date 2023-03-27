import "./App.scss";
import BookList from "./widgets/BookList";
import { Outlet, Link } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <h1>Bookeeper</h1>
      <nav>
        <Link to={"/"}>Home</Link>
        <Link to={"/books/"}>Book Shelf</Link>
        <Link to={"/settings/"}>Settings</Link>
      </nav>
      <Outlet />
    </div>
  );
}

export default App;
