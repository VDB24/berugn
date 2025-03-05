
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Notification {
  id: string;
  user_id: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
  created_at: string;
}

interface NotificationsContextProps {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
}

const NotificationsContext = createContext<NotificationsContextProps | undefined>(undefined);

export const NotificationsProvider = ({ children }: { children: React.ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { currentUser } = useAuth();
  const { toast } = useToast();

  // Calculate unread count
  const unreadCount = notifications.filter(n => !n.read).length;

  // Fetch notifications for the current user
  useEffect(() => {
    if (!currentUser) {
      setNotifications([]);
      return;
    }

    const fetchNotifications = async () => {
      try {
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', currentUser.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Cast types to match the Notification interface
        const typedNotifications = data.map(notification => ({
          ...notification,
          type: notification.type as "info" | "success" | "warning" | "error"
        }));

        setNotifications(typedNotifications);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();

    // Set up real-time subscription for new notifications
    const subscription = supabase
      .channel('notifications_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'notifications',
          filter: `user_id=eq.${currentUser.id}`
        }, 
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newNotification = {
              ...payload.new,
              type: payload.new.type as "info" | "success" | "warning" | "error"
            };
            
            setNotifications(prev => [newNotification, ...prev]);
            
            // Show toast for new notification
            toast({
              title: 'New notification',
              description: payload.new.message,
              variant: payload.new.type === 'error' ? 'destructive' : 'default',
            });
          } else if (payload.eventType === 'DELETE') {
            setNotifications(prev => prev.filter(n => n.id !== payload.old.id));
          } else if (payload.eventType === 'UPDATE') {
            setNotifications(prev => 
              prev.map(n => n.id === payload.new.id ? {
                ...payload.new,
                type: payload.new.type as "info" | "success" | "warning" | "error"
              } : n)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [currentUser, toast]);

  // Mark a notification as read
  const markAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id);

      if (error) throw error;

      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    if (notifications.length === 0) return;
    
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', currentUser?.id)
        .eq('read', false);

      if (error) throw error;

      setNotifications(prev => 
        prev.map(n => ({ ...n, read: true }))
      );
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  // Delete a notification
  const deleteNotification = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  return (
    <NotificationsContext.Provider value={{ 
      notifications, 
      unreadCount, 
      markAsRead, 
      markAllAsRead, 
      deleteNotification 
    }}>
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
};
