import React, { useState } from 'react';
import Login from './component/Login';
import ProductList from './component/ProductList';

import './App.css';


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authHeader, setAuthHeader] = useState('');

  const handleLogin = (username, password) => {
    const basicAuth = 'Basic ' + btoa(username + ':' + password);
    setAuthHeader(basicAuth);
    setIsAuthenticated(true);
  };

  return (
    <div>
      {isAuthenticated ? (
        <ProductList authHeader={authHeader} />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;
