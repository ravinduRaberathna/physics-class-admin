import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(() => {
    return (
      localStorage.getItem('appDarkMode') === 'true' ||
      localStorage.getItem('adminDarkMode') === 'true'
    );
  });

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const adminData = localStorage.getItem('adminData');
    if (token && adminData) {
      setAdmin(JSON.parse(adminData));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const next = !prev;
      localStorage.setItem('appDarkMode', String(next));
      localStorage.setItem('adminDarkMode', String(next));
      return next;
    });
  };

  const login = (data) => {
    localStorage.setItem('adminToken', data.token);
    localStorage.setItem('adminData', JSON.stringify({ name: data.name, email: data.email }));
    setAdmin({ name: data.name, email: data.email });
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, login, logout, loading, darkMode, toggleDarkMode }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);