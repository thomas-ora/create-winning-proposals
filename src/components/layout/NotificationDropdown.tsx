import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, Eye, FileText, CheckCircle2 } from "lucide-react";
import { proposalService } from "@/services/proposalService";
import { formatDistanceToNow } from "date-fns";

export const NotificationDropdown = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const data = await proposalService.getNotifications();
      setNotifications(data);
      // For demo purposes, consider all notifications unread
      setUnreadCount(data.length);
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'view':
        return <Eye className="w-4 h-4 text-blue-500" />;
      case 'download':
        return <FileText className="w-4 h-4 text-green-500" />;
      default:
        return <Bell className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getEventMessage = (event: any) => {
    const proposalTitle = event.proposals?.title || 'Unknown proposal';
    switch (event.event_type) {
      case 'view':
        return `${proposalTitle} was viewed`;
      case 'download':
        return `${proposalTitle} was downloaded`;
      case 'section_view':
        const section = event.event_data?.section || 'a section';
        return `${section} viewed in ${proposalTitle}`;
      default:
        return `Activity on ${proposalTitle}`;
    }
  };

  const markAsRead = () => {
    setUnreadCount(0);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative hover:bg-white/10 transition-colors"
          onClick={() => {
            if (isOpen) markAsRead();
          }}
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0">
        <div className="border-b border-border/50 p-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">Notifications</h4>
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={markAsRead}>
                <CheckCircle2 className="w-4 h-4 mr-1" />
                Mark all read
              </Button>
            )}
          </div>
        </div>
        
        <ScrollArea className="max-h-96">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No notifications yet</p>
            </div>
          ) : (
            <div className="space-y-1 p-2">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  <div className="flex-shrink-0 mt-1">
                    {getEventIcon(notification.event_type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">
                      {getEventMessage(notification)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};