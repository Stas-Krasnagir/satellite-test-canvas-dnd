import React from 'react';
import './App.css';
import Canvas from "./Components/Canvas"

function App() {
  function clearStorage() {
    localStorage.clear()
  }
  
  return (
    <div className="App_container">
      <div className="btn">
        <button onClick={clearStorage} > clearStorage</button>
      </div>
      <div className="canvas_container">
        <Canvas />
      </div>
    </div>
  );
}

export default App;
