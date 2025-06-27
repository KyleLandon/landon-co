import { useState, useEffect, useRef } from "react";
import { useParams } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useWebSocket } from "@/hooks/useWebSocket";
import { motion } from "framer-motion";
import { ArrowLeft, MessageCircle, Clock, User, Send, CheckCircle2, Edit, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import type { Project, Message, ProjectUpdate } from "@/types";

export default function ProjectDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [messageText, setMessageText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const projectId = parseInt(id || "0");

  const { data: project, isLoading: projectLoading } = useQuery<Project>({
    queryKey: [`/api/projects/${id}`],
    enabled: !!id,
  });

  const { data: messages = [], isLoading: messagesLoading, refetch: refetchMessages } = useQuery<Message[]>({
    queryKey: [`/api/projects/${id}/messages`],
    enabled: !!id,
  });

  // WebSocket connection for real-time messaging
  const { joinProject } = useWebSocket({
    onMessage: (data) => {
      if (data.type === 'message-received') {
        // Invalidate and refetch messages to show new message
        queryClient.invalidateQueries({ queryKey: [`/api/projects/${id}/messages`] });
        
        // Auto-scroll to bottom when new message arrives
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    },
    onConnect: () => {
      console.log('Connected to WebSocket');
      if (projectId) {
        joinProject(projectId);
      }
    }
  });

  // Join project room when component mounts or project ID changes
  useEffect(() => {
    if (projectId) {
      // Add a small delay to ensure WebSocket is connected
      const timer = setTimeout(() => {
        joinProject(projectId);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [projectId, joinProject]);

  // Auto-scroll to bottom when messages load initially
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [messages.length]);

  const { data: updates = [], isLoading: updatesLoading } = useQuery<ProjectUpdate[]>({
    queryKey: [`/api/projects/${id}/updates`],
    enabled: !!id,
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      const res = await apiRequest("POST", `/api/projects/${id}/messages`, { message });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/projects/${id}/messages`] });
      setMessageText("");
      toast({
        title: "Message sent",
        description: "Your message has been sent successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    },
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageText.trim()) {
      sendMessageMutation.mutate(messageText);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500";
      case "proposal": return "bg-yellow-500";
      case "completed": return "bg-blue-500";
      case "inquiry": return "bg-gray-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active": return "In Progress";
      case "proposal": return "Proposal";
      case "completed": return "Completed";
      case "inquiry": return "Initial Inquiry";
      default: return status;
    }
  };

  if (projectLoading || messagesLoading || updatesLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white font-mono">Loading project details...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-mono text-white mb-4">Project Not Found</h1>
          <Button onClick={() => window.history.back()} className="bg-white text-black font-mono">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Button 
              onClick={() => window.history.back()}
              variant="ghost" 
              className="text-white hover:bg-gray-800 font-mono mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-mono font-bold mb-2">{project.title}</h1>
                <p className="text-gray-400 font-mono">{project.description}</p>
              </div>
              <Badge className={`${getStatusColor(project.status)} text-white font-mono`}>
                {getStatusText(project.status)}
              </Badge>
            </div>
          </motion.div>

          {/* Project Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          >
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="font-mono text-white flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm font-mono">
                  {project.startDate && (
                    <div>
                      <span className="text-gray-400">Start:</span>{" "}
                      <span className="text-white">
                        {new Date(project.startDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  {project.endDate && (
                    <div>
                      <span className="text-gray-400">End:</span>{" "}
                      <span className="text-white">
                        {new Date(project.endDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="font-mono text-white flex items-center">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Communication
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm font-mono">
                  <div className="text-gray-400">Messages:</div>
                  <div className="text-white text-lg">{messages.length}</div>
                </div>
              </CardContent>
            </Card>

            {project.budget && (
              <Card className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="font-mono text-white">Budget</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-green-400 font-mono text-lg">
                    ${parseFloat(project.budget).toLocaleString()}
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Project Updates */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="font-mono text-white">Project Updates</CardTitle>
                  <CardDescription className="text-gray-400">
                    Latest progress and milestones
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {updates.length === 0 ? (
                      <p className="text-gray-400 font-mono text-center py-8">
                        No updates yet
                      </p>
                    ) : (
                      updates.map((update: any) => (
                        <div key={update.id} className="border-l-4 border-blue-500 pl-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-mono font-medium text-white">{update.title}</h4>
                            {update.isCompleted && (
                              <CheckCircle2 className="w-4 h-4 text-green-500" />
                            )}
                          </div>
                          <p className="text-gray-300 text-sm font-mono mb-2">
                            {update.description}
                          </p>
                          <span className="text-xs text-gray-400 font-mono">
                            {new Date(update.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Messages */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="font-mono text-white">Messages</CardTitle>
                  <CardDescription className="text-gray-400">
                    Communication with the development team
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Messages List */}
                  <div className="space-y-4 max-h-64 overflow-y-auto mb-4">
                    {messages.length === 0 ? (
                      <p className="text-gray-400 font-mono text-center py-8">
                        No messages yet. Start the conversation!
                      </p>
                    ) : (
                      <>
                        {messages.map((message: any) => (
                          <div key={message.id} className="flex space-x-3">
                            <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                              <User className="w-4 h-4 text-gray-300" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <span className="font-mono text-sm text-white">
                                  {message.senderId === user?.id ? "You" : "Admin"}
                                </span>
                                <span className="text-xs text-gray-400 font-mono">
                                  {new Date(message.createdAt).toLocaleString()}
                                </span>
                              </div>
                              <p className="text-gray-300 font-mono text-sm">
                                {message.message}
                              </p>
                            </div>
                          </div>
                        ))}
                        <div ref={messagesEndRef} />
                      </>
                    )}
                  </div>

                  {/* Send Message Form */}
                  <form onSubmit={handleSendMessage} className="flex space-x-2">
                    <Input
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      placeholder="Type your message..."
                      className="bg-black border-gray-700 font-mono"
                      disabled={sendMessageMutation.isPending}
                    />
                    <Button 
                      type="submit" 
                      size="icon"
                      disabled={sendMessageMutation.isPending || !messageText.trim()}
                      className="bg-white text-black hover:bg-gray-200"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}