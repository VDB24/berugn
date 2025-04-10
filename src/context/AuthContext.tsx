
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Provider } from '@supabase/supabase-js';

interface User {
  id: string;
  email: string;
  name?: string;
  profileCompleted: boolean;
}

interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (userData: Partial<User>) => Promise<void>;
  signInWithProvider: (provider: Provider) => Promise<void>;
  verifyOTP: (email: string, otp: string) => Promise<void>;
  resendOTP: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data store - converted to let so we can add new users
let DEMO_USERS = [
  { 
    id: '1', 
    email: 'johndoe@example.com', 
    password: 'password123',
    name: 'John Doe',
    profileCompleted: true
  },
  { 
    id: '2', 
    email: 'demo@example.com', 
    password: 'demo123',
    name: '',
    profileCompleted: false
  }
];

// Mock OTP storage
const MOCK_OTP_STORE: Record<string, string> = {};
// Mock password storage for newly registered users
const MOCK_PASSWORD_STORE: Record<string, string> = {};

// Expose MOCK_OTP_STORE for demonstration purposes (in development only)
if (process.env.NODE_ENV !== 'production') {
  // @ts-ignore - Adding to window for demo purposes
  window.MOCK_OTP_STORE = MOCK_OTP_STORE;
  // @ts-ignore - Adding to window for demo purposes
  window.MOCK_PASSWORD_STORE = MOCK_PASSWORD_STORE;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem('swipe_connect_user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // First check the original demo users
      let user = DEMO_USERS.find(u => u.email === email && u.password === password);
      
      // If not found in demo users, check if this is a newly registered user
      if (!user && MOCK_PASSWORD_STORE[email] === password) {
        // Find the user in our registered users
        const registeredUser = DEMO_USERS.find(u => u.email === email);
        if (registeredUser) {
          user = registeredUser;
        }
      }
      
      if (!user) {
        throw new Error('Invalid email or password');
      }
      
      // Create a user object without the password
      const { password: _, ...userWithoutPassword } = user;
      
      // Save to state and localStorage
      setCurrentUser(userWithoutPassword);
      localStorage.setItem('swipe_connect_user', JSON.stringify(userWithoutPassword));
      
      return Promise.resolve();
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user already exists
      if (DEMO_USERS.some(u => u.email === email) || MOCK_PASSWORD_STORE[email]) {
        throw new Error('Email already in use');
      }
      
      // Store password for later login (after OTP verification)
      MOCK_PASSWORD_STORE[email] = password;
      
      // Generate a random 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Store OTP in our mock store
      MOCK_OTP_STORE[email] = otp;
      
      // In a real app, you would send this OTP to the user's email
      console.log(`OTP for ${email}: ${otp}`);
      
      // Don't create the user yet - require OTP verification first
      return Promise.resolve();
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async (email: string, otp: string) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if OTP matches
      if (MOCK_OTP_STORE[email] !== otp) {
        throw new Error('Invalid OTP');
      }
      
      // Clear OTP after successful verification
      delete MOCK_OTP_STORE[email];
      
      // Find or create user with matching email
      const existingUser = DEMO_USERS.find(u => u.email === email);
      
      if (existingUser) {
        // User exists, this is a login verification
        const { password: _, ...userWithoutPassword } = existingUser;
        
        // Save to state and localStorage
        setCurrentUser(userWithoutPassword);
        localStorage.setItem('swipe_connect_user', JSON.stringify(userWithoutPassword));
      } else {
        // Create new user (for registration)
        const newUser = {
          id: `${DEMO_USERS.length + 1}`,
          email,
          password: MOCK_PASSWORD_STORE[email], // Store password for future logins
          profileCompleted: false
        };
        
        // Add the new user to our demo users array
        DEMO_USERS.push(newUser);
        
        // Create a user object without the password for state/localStorage
        const { password: _, ...userWithoutPassword } = newUser;
        
        // Save to state and localStorage
        setCurrentUser(userWithoutPassword);
        localStorage.setItem('swipe_connect_user', JSON.stringify(userWithoutPassword));
      }
      
      return Promise.resolve();
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const resendOTP = async (email: string) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate a new random 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Store OTP in our mock store
      MOCK_OTP_STORE[email] = otp;
      
      // In a real app, you would send this OTP to the user's email
      console.log(`New OTP for ${email}: ${otp}`);
      
      return Promise.resolve();
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    // Clear user from state and localStorage
    setCurrentUser(null);
    localStorage.removeItem('swipe_connect_user');
    return Promise.resolve();
  };

  const updateUserProfile = async (userData: Partial<User>) => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (!currentUser) {
        throw new Error('No user is logged in');
      }
      
      // Update user data
      const updatedUser = { ...currentUser, ...userData };
      
      // Save updated user to state and localStorage
      setCurrentUser(updatedUser);
      localStorage.setItem('swipe_connect_user', JSON.stringify(updatedUser));
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithProvider = async (provider: Provider) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: window.location.origin + '/browse',
        },
      });
      
      if (error) {
        throw error;
      }
      
      // The user will be redirected to the provider's login page
      // and then back to the redirectTo URL
      // We don't need to set the user here as it will be handled on redirect
    } catch (error) {
      console.error('Error signing in with provider:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    currentUser,
    isLoading,
    login,
    register,
    logout,
    updateUserProfile,
    signInWithProvider,
    verifyOTP,
    resendOTP
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
