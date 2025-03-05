
import React from 'react';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Bell } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useNotifications } from '@/context/NotificationsContext';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface NotificationItemProps {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  time: string;
  onMarkAsRead: (id: string) => Promise<void>;
}

const NotificationItem = ({ id, message, type, read, time, onMarkAsRead }: NotificationItemProps) => {
  const formattedTime = new Date(time).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  });

  const handleClick = () => {
    if (!read) {
      onMarkAsRead(id);
    }
  };

  const getBgColor = () => {
    if (read) return '';
    
    switch (type) {
      case 'success':
        return 'bg-green-50 dark:bg-green-950/40';
      case 'warning':
        return 'bg-yellow-50 dark:bg-yellow-950/40';
      case 'error':
        return 'bg-red-50 dark:bg-red-950/40';
      default:
        return 'bg-blue-50 dark:bg-blue-950/40';
    }
  };

  return (
    <div 
      className={cn(
        "p-3 border-b last:border-b-0 cursor-pointer hover:bg-muted/50",
        getBgColor()
      )}
      onClick={handleClick}
    >
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium">{message}</p>
        {!read && (
          <div className="w-2 h-2 bg-primary rounded-full mt-1.5"></div>
        )}
      </div>
      <p className="text-xs text-muted-foreground mt-1">{formattedTime}</p>
    </div>
  );
};

const NotificationsPopover = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, loading } = useNotifications();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell size={20} />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 text-[10px]" variant="destructive">
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-3 border-b">
          <h3 className="font-medium">Notifications</h3>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs h-8"
              onClick={() => markAllAsRead()}
            >
              Mark all as read
            </Button>
          )}
        </div>
        
        <ScrollArea className="h-[300px]">
          {loading ? (
            <div className="p-4 text-center text-muted-foreground">
              Loading notifications...
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              No notifications yet
            </div>
          ) : (
            notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                id={notification.id}
                message={notification.message}
                type={notification.type as 'info' | 'success' | 'warning' | 'error'}
                read={notification.read}
                time={notification.created_at}
                onMarkAsRead={markAsRead}
              />
            ))
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationsPopover;
