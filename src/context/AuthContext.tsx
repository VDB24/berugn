
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Provider, Session, User } from '@supabase/supabase-js';

interface CustomUser {
  id: string;
  email: string;
  name?: string;
  profileCompleted: boolean;
}

interface AuthContextType {
  currentUser: CustomUser | null;
  isLoading: boolean;
  logout: () => Promise<void>;
  signInWithProvider: (provider: Provider) => Promise<{ error?: Error }>;
  updateUserProfile: (profileData: Partial<{ profileCompleted: boolean; name: string }>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_STORAGE_KEY = 'swipe_connect_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<CustomUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Try to load saved user from localStorage first for faster UI rendering
    const savedUser = localStorage.getItem(USER_STORAGE_KEY);
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Failed to parse saved user:', error);
        localStorage.removeItem(USER_STORAGE_KEY);
      }
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        // Get user metadata from localStorage if available
        const savedUserData = localStorage.getItem(USER_STORAGE_KEY);
        let profileCompleted = false;
        
        if (savedUserData) {
          try {
            const savedUser = JSON.parse(savedUserData);
            profileCompleted = savedUser.profileCompleted || false;
          } catch (error) {
            console.error('Failed to parse saved user data:', error);
          }
        }
        
        const user: CustomUser = {
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || '',
          profileCompleted: profileCompleted
        };
        setCurrentUser(user);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
      } else {
        setCurrentUser(null);
        localStorage.removeItem(USER_STORAGE_KEY);
      }
      setIsLoading(false);
    });

    // Initialize session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        // Get user metadata from localStorage if available
        const savedUserData = localStorage.getItem(USER_STORAGE_KEY);
        let profileCompleted = false;
        
        if (savedUserData) {
          try {
            const savedUser = JSON.parse(savedUserData);
            profileCompleted = savedUser.profileCompleted || false;
          } catch (error) {
            console.error('Failed to parse saved user data:', error);
          }
        }
        
        const user: CustomUser = {
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || '',
          profileCompleted: profileCompleted
        };
        setCurrentUser(user);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
      } else {
        setCurrentUser(null);
        localStorage.removeItem(USER_STORAGE_KEY);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signInWithProvider = async (provider: Provider) => {
    setIsLoading(true);
    try {
      const origin = window.location.origin;
      const redirectTo = `${origin}/browse`;

      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo,
          scopes: provider === 'google' ? 'profile email' : undefined,
        },
      });

      if (error) {
        return { error };
      }
      return { error: undefined };
    } catch (error) {
      return { error: error instanceof Error ? error : new Error('Unknown error occurred') };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await supabase.auth.signOut();
      setCurrentUser(null);
      localStorage.removeItem(USER_STORAGE_KEY);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserProfile = async (profileData: Partial<{ profileCompleted: boolean; name: string }>) => {
    if (!currentUser) return;
    
    const updatedUser = { ...currentUser, ...profileData };
    setCurrentUser(updatedUser);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
    
    console.log('User profile updated:', updatedUser);
  };

  const value = {
    currentUser,
    isLoading,
    logout,
    signInWithProvider,
    updateUserProfile,
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
