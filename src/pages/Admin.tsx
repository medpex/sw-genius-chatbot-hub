
import React, { useState } from 'react';
import AdminLogin from '@/components/Admin/AdminLogin';
import AdminDashboard from '@/components/Admin/AdminDashboard';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const handleLogin = (username: string, password: string) => {
    // In einer echten Anwendung würde hier eine API-Authentifizierung stattfinden
    setIsAuthenticated(true);
  };
  
  const handleLogout = () => {
    setIsAuthenticated(false);
  };
  
  return isAuthenticated ? (
    <AdminDashboard onLogout={handleLogout} />
  ) : (
    <AdminLogin onLogin={handleLogin} />
  );
};

export default Admin;
