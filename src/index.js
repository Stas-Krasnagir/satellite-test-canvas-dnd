import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import firebase from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyBWOhSHROTkF7f9JuPruFHBGGZTlMKStOA",
  authDomain: "satellite-test-canvas-dnd.firebaseapp.com",
  projectId: "satellite-test-canvas-dnd",
  storageBucket: "satellite-test-canvas-dnd.appspot.com",
  messagingSenderId: "1053165702609",
  appId: "1:1053165702609:web:b82d084140d34d6c55e4f0"
};
firebase.initializeApp(firebaseConfig);

export { firebase };

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

