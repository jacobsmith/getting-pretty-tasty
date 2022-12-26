import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <div className="text-red-500">I'm looking for meals that...</div>
      <input value={ query } onChange={ updateQuery } />
    </div>
  );
}

export default App;
