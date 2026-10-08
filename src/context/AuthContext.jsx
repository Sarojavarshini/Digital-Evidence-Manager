import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Default to Investigator session for immediate app exploration, editable via UI
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('dem_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      id: 2,
      username: 'sjenkins',
      email: 'sarah.jenkins@dem.gov',
      fullName: 'Det. Sarah Jenkins',
      role: 'INVESTIGATOR',
      department: 'Digital Forensics Unit',
      status: 'ACTIVE'
    };
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('dem_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('dem_user');
    }
  }, [user]);

  const login = async (credentials) => {
    const res = await api.login(credentials);
    if (res && res.user) {
      setUser(res.user);
      return res.user;
    }
    throw new Error('Authentication failed');
  };

  const loginAsAdmin = () => {
    const adminUser = {
      id: 1,
      username: 'admin',
      email: 'admin@dem.gov',
      fullName: 'Chief Inspector Cyber Warfare',
      role: 'ADMIN',
      department: 'Executive Cyber Command',
      status: 'ACTIVE'
    };
    setUser(adminUser);
    return adminUser;
  };

  const loginAsInvestigator = () => {
    const invUser = {
      id: 2,
      username: 'sjenkins',
      email: 'sarah.jenkins@dem.gov',
      fullName: 'Det. Sarah Jenkins',
      role: 'INVESTIGATOR',
      department: 'Digital Forensics Unit',
      status: 'ACTIVE'
    };
    setUser(invUser);
    return invUser;
  };

  const logout = () => {
    setUser(null);
  };

  const isAdmin = user?.role === 'ADMIN';
  const isInvestigator = user?.role === 'INVESTIGATOR';

  return (
    <AuthContext.Provider value={{ user, setUser, login, loginAsAdmin, loginAsInvestigator, logout, isAdmin, isInvestigator }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
