import React from 'react';
import './App.css';
import UploadForm from './UploadForm';
import logo from './ATS (2) (1).png'; // Import your logo (adjust the path as needed)

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div className="header-content">
          <img src={logo} alt="KNS ATS Checker Logo" className="logo" />
          <div className="title-container">
            <h1 className="app-title">KNS ATS Checker</h1>
            
          </div>
        </div>
      </header>
      <main>
        <UploadForm />
      </main>
      <footer className="App-footer">
        <p>&copy; 2025 KNS Technologies. All rights reserved.</p>
        <p>
              Analyze resumes for jobs with advanced ATS matching technology.
            </p>
      </footer>
    </div>
  );
}

export default App;
