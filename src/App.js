import logo from "./logo.svg";
import "./App.css";
import { DeleteStream, CreateStream, UpdateStream } from "./Components/index";
function App() {
  return (
    <div className="App">
      <header class="header">
        <h1 class="logo">
          <a href="#">Flexbox</a>
        </h1>
        <ul class="main-nav">
          <li>
            <a href="#">Home</a>
          </li>
          <li>
            <a href="#">About</a>
          </li>
          <li>
            <a href="#">Portfolio</a>
          </li>
          <li>
            <a href="#">Contact</a>
          </li>
        </ul>
        <button className="button">Connect Wallet</button>
      </header>
      <CreateStream />
      <UpdateStream />
      <DeleteStream />
    </div>
  );
}

export default App;
