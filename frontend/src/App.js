import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './components/Login';
import Dashboard from './components/Dashboard';


import './App.css'; 

function App() {
  return (
    
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>SaaS Multi-Tenant Notes App</h1>
        </header>
        <main>
         
          <Routes>
            
            <Route path="/login" element={<Login />} />

            
            <Route path="/dashboard" element={<Dashboard />} />

            
            <Route path="/" element={<Navigate to="/login" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;