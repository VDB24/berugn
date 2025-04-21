
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
  loading: boolean;
}

const NotificationsContext = createContext<NotificationsContextProps | undefined>(undefined);

export const NotificationsProvider = ({ children }: { children: React.ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { currentUser } = useAuth();
  const { toast } = useToast();

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    if (!currentUser) {
      setNotifications([]);
      setLoading(false);
      return;
    }

    const fetchNotifications = async () => {
      setLoading(true);
      try {
        // Now supabase client is well typed, this will work correctly
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', currentUser.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        const typedNotifications = data?.map(item => ({
          ...item,
          type: (item.type as "info" | "success" | "warning" | "error") || "info"
        })) as Notification[];
        
        setNotifications(typedNotifications || []);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch notifications',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();

    const channel = supabase
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
              type: (payload.new.type as "info" | "success" | "warning" | "error") || "info"
            } as Notification;
            
            setNotifications(prev => [newNotification, ...prev]);
            
            toast({
              title: 'New notification',
              description: payload.new.message,
              variant: newNotification.type === 'error' ? 'destructive' : 'default',
            });
          } else if (payload.eventType === 'DELETE') {
            setNotifications(prev => prev.filter(n => n.id !== payload.old.id));
          } else if (payload.eventType === 'UPDATE') {
            const updatedNotification = {
              ...payload.new,
              type: (payload.new.type as "info" | "success" | "warning" | "error") || "info"
            } as Notification;
            
            setNotifications(prev => 
              prev.map(n => n.id === updatedNotification.id ? updatedNotification : n)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUser, toast]);

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
      toast({
        title: 'Error',
        description: 'Failed to mark notification as read',
        variant: 'destructive',
      });
    }
  };

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
      toast({
        title: 'Error',
        description: 'Failed to mark all notifications as read',
        variant: 'destructive',
      });
    }
  };

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
      toast({
        title: 'Error',
        description: 'Failed to delete notification',
        variant: 'destructive',
      });
    }
  };

  return (
    <NotificationsContext.Provider value={{ 
      notifications, 
      unreadCount, 
      markAsRead, 
      markAllAsRead, 
      deleteNotification,
      loading
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
