import React, { useState } from 'react';
import Auth from './pages/auth';
import Login from './pages/login';
import Register from './pages/register';

function App() {
  const [page, setPage] = useState('welcome');
  const [role, setRole] = useState(null);

  const handleLogin = (selectedRole) => {
    setRole(selectedRole);
    setPage('login');
  };

  const handleBack = () => {
    setPage('welcome');
    setRole(null);
  };

  const handleRegister = () => {
    setPage('register');
  };

  return (
    <div className="App">

      {/* Welcome Page */}
      {page === 'welcome' && (
        <Auth
          onAdmin={() => handleLogin('admin')}
          onUser={() => handleLogin('user')}
          onRegister={handleRegister}
        />
      )}

      {/* Admin / User Login */}
      {page === 'login' && (
        <Login
          role={role}
          onBack={handleBack}
        />
      )}

      {/* Normal Account Registration */}
      {page === 'register' && (
        <Register
          onBack={handleBack}
        />
      )}

    </div>
  );
}

export default App;