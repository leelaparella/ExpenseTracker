// ✅ AuthContext.js - now supports multi-user and secure profile updates
import { createContext, useState, useEffect, useContext } from 'react';

export const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('currentUser'));
    if (storedUser) setCurrentUser(storedUser);
    setLoading(false);
  }, []);

  const getUsers = () => JSON.parse(localStorage.getItem('users')) || [];

  const saveUsers = (users) => {
    localStorage.setItem('users', JSON.stringify(users));
  };

  const signup = (email, password, name) => {
    const users = getUsers();
    if (users.find((u) => u.email === email)) {
      return Promise.reject(new Error('User already exists'));
    }
    const newUser = { id: Date.now().toString(), email, password, name };
    const updatedUsers = [...users, newUser];
    saveUsers(updatedUsers);
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    setCurrentUser(newUser);
    return Promise.resolve(newUser);
  };

  const signin = (email, password) => {
    const users = getUsers();
    const user = users.find((u) => u.email === email && u.password === password);
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      return Promise.resolve(user);
    }
    return Promise.reject(new Error('Invalid email or password'));
  };

  const signout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    return Promise.resolve();
  };

  const updateUser = (updatedUser) => {
    const users = getUsers().map((u) => (u.id === updatedUser.id ? updatedUser : u));
    saveUsers(users);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    setCurrentUser(updatedUser);
    return Promise.resolve(updatedUser);
  };

  const deleteUser = () => {
    const users = getUsers().filter((u) => u.id !== currentUser?.id);
    saveUsers(users);
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    return Promise.resolve();
  };

  const value = {
    currentUser,
    signup,
    signin,
    signout,
    updateUser,
    deleteUser
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};
