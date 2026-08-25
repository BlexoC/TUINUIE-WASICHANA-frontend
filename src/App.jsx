import React, { useState } from 'react';
import Auth from './pages/auth';
import Login from './pages/login';

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

  return (
    <div className="App">

      {page === 'welcome' && (
        <Auth
          onAdmin={() => handleLogin('admin')}
          onUser={() => handleLogin('user')}
          onRegister={() => {
            console.log('Register clicked');
          }}
        />
      )}

      {page === 'login' && (
        <Login
          role={role}
          onBack={handleBack}
        />
      )}

    </div>
  );
}

export default App;