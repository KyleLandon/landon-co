import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { MessageCircle, User, Clock } from "lucide-react";
import AdminLayout from "../admin-layout";
import AppleMessaging from "@/components/apple-messaging";
import type { Project, Message, User as UserType } from "@shared/schema";

export default function AdminProjectMessages() {
  const { id } = useParams();
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [newMessage, setNewMessage] = useState("");

  const { data: project } = useQuery<Project>({
    queryKey: [`/api/projects/${id}`],
    enabled: !!id,
  });

  const { data: client } = useQuery<UserType>({
    queryKey: [`/api/users/${project?.clientId}`],
    enabled: !!project?.clientId,
  });

  const { data: messages, isLoading: messagesLoading } = useQuery<Message[]>({
    queryKey: [`/api/projects/${id}/messages`],
    enabled: !!id,
    refetchInterval: 3000, // Auto-refresh every 3 seconds
  });

  const sendMessage = useMutation({
    mutationFn: async (messageData: { message: string }) => {
      console.log("Sending message from admin:", messageData);
      return apiRequest("POST", `/api/projects/${id}/messages`, messageData);
    },
    onSuccess: () => {
      console.log("Message sent successfully from admin");
      queryClient.invalidateQueries({ queryKey: [`/api/projects/${id}/messages`] });
      setNewMessage("");
      toast({
        title: "Message sent",
        description: "Your message has been sent to the client",
      });
    },
    onError: (error: any) => {
      console.error("Admin message send error:", error);
      toast({
        title: "Error",
        description: `Failed to send message: ${error?.message || "Unknown error"}`,
        variant: "destructive",
      });
    },
  });

  const markAsRead = useMutation({
    mutationFn: async (messageId: number) => {
      return apiRequest("PATCH", `/api/messages/${messageId}/read`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/projects/${id}/messages`] });
    },
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Admin handleSendMessage called with:", newMessage);
    
    if (!newMessage.trim()) {
      console.log("Empty message, not sending");
      return;
    }
    
    if (!id) {
      console.error("No project ID available");
      toast({
        title: "Error",
        description: "Project ID is missing",
        variant: "destructive",
      });
      return;
    }
    
    console.log("Attempting to send message:", newMessage.trim());
    sendMessage.mutate({ message: newMessage.trim() });
  };

  // Notification sound function
  const playMessageSound = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.1);
      gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.2);
    } catch (error) {
      console.log('Audio not available or blocked by browser');
    }
  };

  // Track previous message count for new message detection
  const [previousMessageCount, setPreviousMessageCount] = useState(0);

  // Auto-scroll to bottom when new messages arrive and play sound
  useEffect(() => {
    if (messages && messages.length > previousMessageCount && previousMessageCount > 0) {
      // Check if the new message is from a client (not admin)
      const latestMessage = messages[messages.length - 1];
      if (latestMessage && latestMessage.senderId !== user?.id) {
        playMessageSound();
      }
    }
    setPreviousMessageCount(messages?.length || 0);
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, previousMessageCount, user?.id]);

  // Mark unread messages as read when viewed
  useEffect(() => {
    if (messages) {
      const unreadMessages = messages.filter(msg => !msg.isRead && msg.senderId !== "admin");
      unreadMessages.forEach(msg => {
        markAsRead.mutate(msg.id);
      });
    }
  }, [messages]);

  const formatMessageTime = (createdAt: Date | string | null) => {
    if (!createdAt) return "Unknown";
    const date = new Date(createdAt);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  if (messagesLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-400 font-mono">Loading messages...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white font-mono">Project Messages</h1>
            <p className="text-gray-400 font-mono mt-2">
              Communicate with {client?.firstName || 'Client'} about {project?.title}
            </p>
          </div>
          <div className="flex items-center gap-4">
            {project && (
              <Badge className="bg-blue-600 text-white font-mono">
                {project.status}
              </Badge>
            )}
            <div className="text-sm text-gray-400 font-mono">
              {messages?.length || 0} total messages
            </div>
          </div>
        </div>

        {/* Messages Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Messages Area */}
          <div className="lg:col-span-3">
            <Card className="bg-gray-900 border-gray-700 h-[600px] flex flex-col">
              <CardHeader className="border-b border-gray-700">
                <CardTitle className="text-white font-mono flex items-center">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Conversation
                </CardTitle>
                <CardDescription className="text-gray-400 font-mono">
                  Messages refresh automatically every 3 seconds
                </CardDescription>
              </CardHeader>
              
              {/* Messages Area */}
              <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages && messages.length > 0 ? (
                  messages.map((message) => {
                    const isAdmin = message.senderId !== client?.id;
                    return (
                      <div key={message.id} className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[70%] p-3 rounded-lg ${
                          isAdmin 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-800 text-white border border-gray-700'
                        }`}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs opacity-75 font-mono">
                              {isAdmin ? 'Admin' : (client?.firstName || 'Client')}
                            </span>
                            <span className="text-xs opacity-75 font-mono">
                              {formatMessageTime(message.createdAt)}
                            </span>
                          </div>
                          <p className="font-mono text-sm">{message.message}</p>
                          {!message.isRead && !isAdmin && (
                            <div className="flex items-center mt-1">
                              <Clock className="w-3 h-3 mr-1 opacity-75" />
                              <span className="text-xs opacity-75 font-mono">Unread</span>
                            </div>
                          )}
                          {message.isRead && isAdmin && (
                            <div className="flex items-center mt-1 justify-end">
                              <CheckCircle2 className="w-3 h-3 mr-1 opacity-75" />
                              <span className="text-xs opacity-75 font-mono">Read</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center text-gray-400 font-mono">
                      <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No messages yet</p>
                      <p className="text-sm mt-1">Start a conversation with your client</p>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </CardContent>

              {/* Message Input */}
              <div className="border-t border-gray-700 p-4">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="bg-gray-800 border-gray-700 text-white font-mono flex-1"
                    disabled={sendMessage.isPending}
                  />
                  <Button 
                    type="submit" 
                    disabled={!newMessage.trim() || sendMessage.isPending}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-mono px-6"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Client Info */}
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white font-mono flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Client
                </CardTitle>
              </CardHeader>
              <CardContent>
                {client ? (
                  <div className="space-y-3">
                    <div>
                      <span className="text-gray-400 font-mono text-sm">Name:</span>
                      <p className="text-white font-mono">{client.firstName} {client.lastName}</p>
                    </div>
                    <div>
                      <span className="text-gray-400 font-mono text-sm">Email:</span>
                      <p className="text-white font-mono text-sm">{client.email}</p>
                    </div>
                    <div className="pt-2">
                      <Badge variant="outline" className="border-gray-600 text-gray-300 font-mono">
                        Active Client
                      </Badge>
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-400 font-mono">Loading client info...</div>
                )}
              </CardContent>
            </Card>

            {/* Project Info */}
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white font-mono">Project</CardTitle>
              </CardHeader>
              <CardContent>
                {project ? (
                  <div className="space-y-3">
                    <div>
                      <span className="text-gray-400 font-mono text-sm">Title:</span>
                      <p className="text-white font-mono">{project.title}</p>
                    </div>
                    <div>
                      <span className="text-gray-400 font-mono text-sm">Status:</span>
                      <p className="text-white font-mono capitalize">{project.status}</p>
                    </div>
                    {project.budget && (
                      <div>
                        <span className="text-gray-400 font-mono text-sm">Budget:</span>
                        <p className="text-white font-mono">{project.budget}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-gray-400 font-mono">Loading project info...</div>
                )}
              </CardContent>
            </Card>

            {/* Message Stats */}
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white font-mono">Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400 font-mono text-sm">Total Messages:</span>
                  <span className="text-white font-mono">{messages?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 font-mono text-sm">Unread:</span>
                  <span className="text-white font-mono">
                    {messages?.filter(m => !m.isRead && m.senderId !== "admin").length || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 font-mono text-sm">Last Activity:</span>
                  <span className="text-white font-mono text-sm">
                    {messages && messages.length > 0 
                      ? formatMessageTime(messages[messages.length - 1].createdAt)
                      : "No activity"
                    }
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}