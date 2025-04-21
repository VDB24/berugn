
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
  updateUserProfile?: (profileData: Partial<{ profileCompleted: boolean; name: string }>) => Promise<void>;
  // Removed verifyOTP and resendOTP for emailless login
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<CustomUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const user: CustomUser = {
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || '',
          profileCompleted: false // Future: update after profile info is filled
        };
        setCurrentUser(user);
        localStorage.setItem('swipe_connect_user', JSON.stringify(user));
      } else {
        setCurrentUser(null);
        localStorage.removeItem('swipe_connect_user');
      }
      setIsLoading(false);
    });

    // also initialize session the first time
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const user: CustomUser = {
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || '',
          profileCompleted: false
        };
        setCurrentUser(user);
        localStorage.setItem('swipe_connect_user', JSON.stringify(user));
      } else {
        setCurrentUser(null);
        localStorage.removeItem('swipe_connect_user');
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
      localStorage.removeItem('swipe_connect_user');
    } finally {
      setIsLoading(false);
    }
  };

  // A stub for updateUserProfile to avoid errors if called
  // Might be kept if needed for Google/LinkedIn-based onboarding flows
  const updateUserProfile = async (profileData: Partial<{ profileCompleted: boolean; name: string }>) => {
    // Normally here you'd update the user profile information in your DB
    // For now, just update the local currentUser state as a placeholder
    if (!currentUser) return;
    setCurrentUser(prev => prev ? { ...prev, ...profileData } : prev);
  };

  // Removed verifyOTP and resendOTP functions

  const value = {
    currentUser,
    isLoading,
    logout,
    signInWithProvider,
    updateUserProfile,
    // Removed verifyOTP and resendOTP from the context value
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
