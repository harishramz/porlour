import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialCustomers } from '../data/customers';
import { updateCustomerProfile as apiUpdateCustomerProfile } from '../services/api';

const AuthContext = createContext(null);

const AUTH_STORAGE_KEY = 'aura_luxe_auth_state';

export const AuthProvider = ({ children }) => {
  // Initialize with Harish Varma by default so customer dashboard & appointments work seamlessly,
  // or restore from localStorage if set.
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse saved auth state', e);
    }
    // Default logged in as customer Harish Varma
    return {
      ...initialCustomers[0],
      role: 'customer',
      isAuthenticated: true
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } catch (e) {
      console.error('Failed to persist auth state', e);
    }
  }, [user]);

  const login = (userData) => {
    const updated = {
      ...userData,
      isAuthenticated: true
    };
    setUser(updated);
    return updated;
  };

  const loginAsCustomer = (customerData = initialCustomers[0]) => {
    return login({
      ...customerData,
      role: 'customer'
    });
  };

  const loginAsAdmin = () => {
    return login({
      id: 'admin-1',
      name: 'Super Admin Manager',
      email: 'admin@auraluxe.com',
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80'
    });
  };

  const logout = () => {
    setUser({
      id: null,
      name: 'Guest',
      email: '',
      role: 'guest',
      isAuthenticated: false
    });
  };

  const updateUserProfile = async (updatedFields) => {
    if (!user || user.role !== 'customer') return;
    const updated = { ...user, ...updatedFields };
    setUser(updated);
    if (user.id) {
      await apiUpdateCustomerProfile(user.id, updatedFields);
    }
    return updated;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user.role,
        isAuthenticated: !!user.isAuthenticated && user.role !== 'guest',
        login,
        loginAsCustomer,
        loginAsAdmin,
        logout,
        updateUserProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
