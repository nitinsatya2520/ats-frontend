// src/App.js

import React from 'react';
import './App.css';
import UploadForm from './UploadForm';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>ATS Resume Checker</h1>
      </header>
      <main>
        <UploadForm />
      </main>
    </div>
  );
}

export default App;
