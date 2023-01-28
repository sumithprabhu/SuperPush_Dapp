import logo from './logo.svg';
import './App.css';
import {DeleteStream, CreateStream} from './Components/index';
function App() {
  return (
    <div className="App">
      <CreateStream />
      <DeleteStream />
    </div>
  );
}

export default App;
