// src/App.tsx
import React from 'react';
import Login from './components/auth/Login';
import { AdminApp } from './components/apps/AdminApp';
import { ParentApp } from './components/apps/ParentApp';
import { DriverApp } from './components/apps/DriverApp';
import { AppDataProvider } from './contexts/AppDataContext';
import { useAuth } from './hooks/useAuth';

const App = () => {
  const { user, login, logout, isAuthenticated } = useAuth();

  // now handleLogin accepts role
  const handleLogin = async (username: string, password: string, role: 'admin' | 'parent' | 'driver' = 'parent') => {
    console.log('Login attempt:', { username, role });
    const result = await login(username, password, role);
    console.log('Login result:', result, 'User:', user);
    return result;
  };

  if (!isAuthenticated || !user) {
    return <Login onLogin={handleLogin} />;
  }

  const renderApp = () => {
    if (!user.role || !['admin', 'parent', 'driver'].includes(user.role)) {
      logout();
      return <Login onLogin={handleLogin} />;
    }

    switch (user.role) {
      case 'admin':
        return <AdminApp user={user} onLogout={logout} />;
      case 'parent':
        return <ParentApp user={user} onLogout={logout} />;
      case 'driver':
        return <DriverApp user={user} onLogout={logout} />;
      default:
        logout();
        return <Login onLogin={handleLogin} />;
    }
  };

  return (
    <AppDataProvider>
      {renderApp()}
    </AppDataProvider>
  );
};

export default App;
