import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialCustomers } from '../data/customers';
import { updateCustomerProfile as apiUpdateCustomerProfile } from '../services/api';
import { getAuthenticatedProfile, supabase, supabaseConfigured } from '../services/supabase';

const AuthContext = createContext(null);

const AUTH_STORAGE_KEY = 'aura_luxe_auth_state';
const getEmailConfirmationRedirectUrl = () => `${window.location.origin}/login?confirmation=confirmed`;
const guestUser = {
  id: null,
  name: 'Guest',
  email: '',
  role: 'guest',
  isAuthenticated: false
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    if (supabaseConfigured) return guestUser;
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse saved auth state', e);
    }
    return {
      ...initialCustomers[0],
      role: 'customer',
      isAuthenticated: true
    };
  });
  const [authLoading, setAuthLoading] = useState(supabaseConfigured);

  useEffect(() => {
    if (!supabase) return undefined;
    let active = true;

    const restoreSession = async (session) => {
      if (!session) {
        if (active) {
          setUser(guestUser);
          setAuthLoading(false);
        }
        return;
      }

      try {
        const authenticatedUser = await getAuthenticatedProfile(session.user);
        if (active) setUser(authenticatedUser);
      } catch (error) {
        console.error('Unable to load the Supabase profile:', error);
        if (active) setUser(guestUser);
      } finally {
        if (active) setAuthLoading(false);
      }
    };

    supabase.auth.getSession().then(({ data, error }) => {
      if (error) console.error('Unable to restore the Supabase session:', error);
      return restoreSession(data?.session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      window.setTimeout(() => restoreSession(session), 0);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (supabaseConfigured) return;
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } catch (e) {
      console.error('Failed to persist auth state', e);
    }
  }, [user]);

  const login = (userData) => {
    if (supabaseConfigured) return user;
    const updated = {
      ...userData,
      isAuthenticated: true
    };
    setUser(updated);
    return updated;
  };

  const loginAsCustomer = (customerData = initialCustomers[0]) => {
    if (supabaseConfigured) return user;
    return login({
      ...customerData,
      role: 'customer'
    });
  };

  const loginAsAdmin = () => {
    if (supabaseConfigured) return user;
    const adminUser = {
      id: 'admin-1',
      name: 'Super Admin Manager',
      email: 'admin@aura-luxe.local',
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80'
    };
    return login({
      ...adminUser,
      isAuthenticated: true
    });
  };

  const signInWithPassword = async (email, password) => {
    if (!supabase) throw new Error('Supabase is not configured.');
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password
    });
    if (error) throw error;
    if (!data.session?.access_token) {
      throw new Error('Sign-in did not return an active session. Confirm your email address and try again.');
    }
    const authenticatedUser = await getAuthenticatedProfile(data.user);
    setUser(authenticatedUser);
    return authenticatedUser;
  };

  const signUp = async ({ name, email, password, phone }) => {
    if (!supabase) throw new Error('Supabase is not configured.');
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name, phone: phone || '' },
        emailRedirectTo: getEmailConfirmationRedirectUrl()
      }
    });
    if (error) throw error;
    if (!data.session) return { requiresEmailConfirmation: true };

    const authenticatedUser = await getAuthenticatedProfile(data.user);
    setUser(authenticatedUser);
    return { user: authenticatedUser, requiresEmailConfirmation: false };
  };

  const resendSignupConfirmation = async (email) => {
    if (!supabase) throw new Error('Supabase is not configured.');
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: { emailRedirectTo: getEmailConfirmationRedirectUrl() }
    });
    if (error) throw error;
  };

  const signInWithGoogle = async () => {
    if (!supabase) throw new Error('Supabase is not configured.');
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin }
    });
    if (error) throw error;
  };

  const sendPasswordReset = async (email, redirectTo = '/forgot-password?mode=reset') => {
    if (!supabase) throw new Error('Supabase is not configured.');
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}${redirectTo}`
    });
    if (error) throw error;
  };

  const updatePassword = async (password) => {
    if (!supabase) throw new Error('Supabase is not configured.');
    const { error } = await supabase.auth.updateUser({ password });
    if (error) throw error;
  };

  const logout = async () => {
    if (supabase) {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    }
    setUser(guestUser);
  };

  const updateUserProfile = async (updatedFields) => {
    if (!user || user.role !== 'customer') return;
    const updated = await apiUpdateCustomerProfile(user.id, updatedFields);
    const nextUser = { ...user, ...updated };
    setUser(nextUser);
    return nextUser;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user.role,
        isAuthenticated: !!user.isAuthenticated && user.role !== 'guest',
        authLoading,
        login,
        loginAsCustomer,
        loginAsAdmin,
        signInWithPassword,
        signUp,
        resendSignupConfirmation,
        signInWithGoogle,
        sendPasswordReset,
        updatePassword,
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
