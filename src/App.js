import React from 'react';
import './App.css';
import Canvas from "./Components/Canvas";
import { addItem, getItems } from "./Components/LocaStorage";

function App() {
  function clearStorage() {
    localStorage.clear()
  }

  function saveData() {
    try {
      let obj = getItems();
      if (!obj) {
        alert("Нечего сохронять!")
        return null
      }
      let blob = new Blob([JSON.stringify(obj)], { type: 'application/json' });
      let url = URL.createObjectURL(blob);
      let a = document.createElement('a');
      a.href = url;
      a.download = "backup.json";
      a.textContent = "Download backup.json";
      document.getElementById('json').appendChild(a);
    }
    catch (err) {
      console.log(err);
    }
  }

  function readData() {
    try {
      let file = document.getElementById('file').files[0];
      if (!file) {
        alert("Выберите файл")
        return null
      }
      let sFileName = file.name;
      let sFileExtension = sFileName.split('.')[sFileName.split('.').length - 1].toLowerCase();
      let extensionList = ['json'];
      if (!extensionList.includes(sFileExtension)) {
        alert("Выберите json файл")
        return null
      }
      let reader = new FileReader();
      reader.readAsText(file);
      reader.onload = function () {
        let res = JSON.parse(reader.result);
        if (!res) {
          alert("Файл пустой")
          return null
        }
        res.forEach(element => {
          addItem(element)
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="App_container">
      <div className="btn">
        <button onClick={clearStorage} > Clear Storage</button>
        <button onClick={saveData} > Save</button>
        <div id="json"></div>
        <input type="file" id="file" />
        <button onClick={readData}> Read</button>
      </div>
      <div className="canvas_container">
        <Canvas />
      </div>
    </div>
  );
}

export default App;
