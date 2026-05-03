import { useState, useEffect } from 'react';
import { GlobalStyles } from './styles/GlobalStyles';
import { LoginPage } from './pages/LoginPage';
import { SchedulesPage } from './pages/SchedulesPage';
import { setAuthCredentials } from './api/client';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const savedAuth = localStorage.getItem('auth');
    if (savedAuth) {
      const decoded = atob(savedAuth);
      const [username, password] = decoded.split(':');
      setAuthCredentials(username, password);
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <>
      <GlobalStyles />
      {isAuthenticated ? (
        <SchedulesPage onLogout={handleLogout} />
      ) : (
        <LoginPage onLogin={handleLogin} />
      )}
    </>
  );
}

export default App;
