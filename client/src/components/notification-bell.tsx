import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, MessageCircle, FileText, X, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useWebSocket } from "@/hooks/useWebSocket";

interface Notification {
  id: string;
  type: 'message' | 'project_request' | 'project_update';
  title: string;
  description: string;
  projectId?: number;
  projectTitle?: string;
  timestamp: Date;
  read: boolean;
}

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const queryClient = useQueryClient();

  // Fetch unread message count
  const { data: unreadCount = 0 } = useQuery<number>({
    queryKey: ["/api/admin/unread-count"],
    refetchInterval: 5000, // Refetch every 5 seconds
  });

  // Fetch recent activity for notifications
  const { data: recentActivity = [] } = useQuery<any[]>({
    queryKey: ["/api/admin/recent-activity"],
    refetchInterval: 3000, // Refetch every 3 seconds
  });

  // Notification sound function
  const playNotificationSound = () => {
    try {
      // Create a simple notification beep using Web Audio API
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (error) {
      console.log('Audio not available or blocked by browser');
    }
  };

  // WebSocket for real-time notifications
  useWebSocket({
    onMessage: (data) => {
      if (data.type === 'new-notification') {
        // Add new notification to the list
        const newNotification: Notification = {
          id: Date.now().toString(),
          type: data.notificationType,
          title: data.title,
          description: data.description,
          projectId: data.projectId,
          projectTitle: data.projectTitle,
          timestamp: new Date(),
          read: false
        };
        
        setNotifications(prev => [newNotification, ...prev.slice(0, 9)]); // Keep last 10
        
        // Play notification sound
        playNotificationSound();
        
        // Invalidate relevant queries
        queryClient.invalidateQueries({ queryKey: ["/api/admin/unread-count"] });
        queryClient.invalidateQueries({ queryKey: ["/api/admin/recent-activity"] });
      }
    }
  });

  // Initialize notifications from recent activity
  useEffect(() => {
    const notifs: Notification[] = recentActivity.map((activity, index) => ({
      id: `${activity.id}-${activity.type}`,
      type: activity.type === 'message' ? 'message' : 
            activity.type === 'submission' ? 'project_request' : 'project_update',
      title: getNotificationTitle(activity),
      description: getNotificationDescription(activity),
      projectId: activity.projectId,
      projectTitle: activity.projectTitle,
      timestamp: new Date(activity.createdAt),
      read: false
    }));
    
    setNotifications(notifs);
  }, [recentActivity]);

  const getNotificationTitle = (activity: any) => {
    switch (activity.type) {
      case 'message':
        return 'New Message';
      case 'submission':
        return 'New Project Request';
      case 'contact':
        return 'New Contact Form';
      default:
        return 'New Activity';
    }
  };

  const getNotificationDescription = (activity: any) => {
    switch (activity.type) {
      case 'message':
        return `${activity.senderName || 'Client'} sent a message in ${activity.projectTitle}`;
      case 'submission':
        return `${activity.name} submitted a project request: ${activity.projectTitle}`;
      case 'contact':
        return `${activity.name} sent a contact form message`;
      default:
        return activity.description || 'New activity';
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'message':
        return <MessageCircle className="w-4 h-4 text-blue-400" />;
      case 'project_request':
        return <FileText className="w-4 h-4 text-green-400" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-400" />;
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    // Mark as read when clicked
    markAsRead(notification.id);
    
    if (notification.type === 'message' && notification.projectId) {
      window.location.href = `/admin/projects/${notification.projectId}/messages`;
    } else if (notification.type === 'project_request') {
      window.location.href = '/admin/messages';
    } else if (notification.projectId) {
      window.location.href = `/admin/projects/${notification.projectId}`;
    } else {
      window.location.href = '/admin/messages';
    }
    setIsOpen(false);
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    ));
  };

  const unreadNotificationCount = notifications.filter(n => !n.read).length;

  return (
    <div className="relative">
      {/* Bell Icon */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="relative text-white hover:bg-gray-800"
      >
        <Bell className="w-5 h-5" />
        {unreadNotificationCount > 0 && (
          <Badge 
            className="absolute -top-1 -right-1 bg-red-500 text-white text-xs min-w-[20px] h-5 flex items-center justify-center p-1"
          >
            {unreadNotificationCount > 99 ? '99+' : unreadNotificationCount}
          </Badge>
        )}
      </Button>

      {/* Notification Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-12 w-80 z-50"
          >
            <Card className="bg-black border-white/20 text-white shadow-2xl">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Notifications</CardTitle>
                  <div className="flex items-center gap-2">
                    {notifications.filter(n => !n.read).length > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={markAllAsRead}
                        className="text-xs text-gray-400 hover:text-white"
                      >
                        Mark all read
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsOpen(false)}
                      className="w-6 h-6 text-gray-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0 max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-gray-400">
                    <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>No new notifications</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {notifications.map((notification) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`p-3 cursor-pointer transition-colors hover:bg-gray-800 border-l-4 ${
                          notification.read 
                            ? 'border-transparent bg-gray-900/50' 
                            : 'border-blue-500 bg-gray-900'
                        }`}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-1">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-medium text-white truncate">
                                {notification.title}
                              </h4>
                              <span className="text-xs text-gray-400 ml-2">
                                {getTimeAgo(notification.timestamp)}
                              </span>
                            </div>
                            <p className="text-xs text-gray-300 mt-1 line-clamp-2">
                              {notification.description}
                            </p>
                            {notification.projectTitle && (
                              <p className="text-xs text-blue-400 mt-1">
                                Project: {notification.projectTitle}
                              </p>
                            )}
                          </div>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
                
                {notifications.length > 0 && (
                  <div className="p-3 border-t border-white/10">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        window.location.href = '/admin/messages';
                        setIsOpen(false);
                      }}
                      className="w-full text-blue-400 hover:text-blue-300 text-sm"
                    >
                      View All Messages
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay to close dropdown when clicking outside */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'now';
  if (diffInMinutes < 60) return `${diffInMinutes}m`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d`;
}