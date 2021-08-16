import React from 'react';
import './App.css';
import Canvas from "./Components/Canvas"
function App() {
  function clearStorage() {
    localStorage.clear()
  }

  function saveData() {
    try {
    }
    catch (err) {
      console.log(err);
    }
  }

  function readData() { }


  return (
    <div className="App_container">
      <div className="btn">
        <button onClick={clearStorage} > Clear Storage</button>
        <button onClick={saveData} > Save</button>
        <button onClick={readData} > Read</button>
      </div>
      <div className="canvas_container">
        <Canvas />
      </div>
    </div>
  );
}

export default App;
