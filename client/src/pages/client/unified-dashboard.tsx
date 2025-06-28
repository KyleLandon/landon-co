import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MessageCircle, 
  FileText, 
  Calendar, 
  DollarSign, 
  Clock, 
  Send,
  Plus,
  CheckCircle,
  User,
  LogOut,
  Settings,
  Download,
  Eye
} from "lucide-react";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import AppleMessaging from "@/components/apple-messaging";
import ProjectRequestDialog from "@/components/project-request-dialog";
import type { Project, Message } from "@shared/schema";

export default function UnifiedDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");

  // Fetch user's projects
  const { data: projects = [], isLoading: projectsLoading } = useQuery<Project[]>({
    queryKey: ["/api/my-projects"],
    refetchInterval: 5000, // Auto-refresh every 5 seconds
  });

  // Fetch messages for selected project
  const { data: messages = [] } = useQuery<Message[]>({
    queryKey: [`/api/projects/${selectedProjectId}/messages`],
    enabled: !!selectedProjectId,
    refetchInterval: 3000, // Auto-refresh messages every 3 seconds
  });

  // Get active project (first project or selected one)
  const activeProject = selectedProjectId 
    ? projects.find(p => p.id.toString() === selectedProjectId)
    : projects[0];

  // Quick message mutation
  const sendQuickMessage = useMutation({
    mutationFn: async (message: string) => {
      return apiRequest("POST", `/api/projects/${activeProject?.id}/messages`, { message });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/projects/${activeProject?.id}/messages`] });
      setNewMessage("");
      toast({
        title: "Message sent",
        description: "Your message has been sent to the team",
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500";
      case "proposal": return "bg-yellow-500";
      case "completed": return "bg-blue-500";
      case "pending": return "bg-orange-500";
      case "inquiry": return "bg-gray-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active": return "In Progress";
      case "proposal": return "Proposal";
      case "completed": return "Completed";
      case "pending": return "Pending Review";
      case "inquiry": return "Initial Inquiry";
      default: return status;
    }
  };

  const handleQuickSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeProject) return;
    sendQuickMessage.mutate(newMessage.trim());
  };

  if (projectsLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 font-mono">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      
      <div className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          
          {/* Header with Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-mono font-bold mb-2">
                  Welcome back, {user?.firstName || "Client"}
                </h1>
                <p className="text-gray-400 font-mono">
                  Everything you need in one place
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <ProjectRequestDialog>
                  <Button className="bg-white text-black hover:bg-gray-200 font-mono">
                    <Plus className="w-4 h-4 mr-2" />
                    New Project
                  </Button>
                </ProjectRequestDialog>
                
                <Button
                  onClick={() => window.location.href = "/api/logout"}
                  variant="outline"
                  size="sm"
                  className="bg-transparent border-zinc-700 text-white hover:bg-zinc-800 font-mono"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </motion.div>

          {projects.length === 0 ? (
            // No Projects State
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="bg-zinc-900 border-zinc-800 text-center py-16">
                <CardContent>
                  <MessageCircle className="w-20 h-20 text-white mx-auto mb-6" />
                  <h3 className="text-2xl font-mono font-bold mb-4 text-white">Ready to Start?</h3>
                  <p className="text-gray-400 font-mono mb-8 max-w-md mx-auto">
                    Let's bring your ideas to life. Start by telling us about your project.
                  </p>
                  <ProjectRequestDialog>
                    <Button size="lg" className="bg-white text-black hover:bg-gray-200 font-mono">
                      <Plus className="w-5 h-5 mr-2" />
                      Start Your First Project
                    </Button>
                  </ProjectRequestDialog>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            // Projects Dashboard
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left Column - Project Overview */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="lg:col-span-1 space-y-6"
              >
                
                {/* Project Selector */}
                <Card className="bg-zinc-900 border-zinc-800">
                  <CardHeader>
                    <CardTitle className="font-mono text-lg text-white">Your Projects</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {projects.map((project) => (
                      <div
                        key={project.id}
                        onClick={() => setSelectedProjectId(project.id.toString())}
                        className={`p-3 rounded-lg cursor-pointer transition-colors ${
                          activeProject?.id === project.id 
                            ? 'bg-white/10 border border-white/20' 
                            : 'hover:bg-white/5'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-mono font-bold text-white truncate">{project.title}</h4>
                          <Badge className={`${getStatusColor(project.status)} text-white text-xs`}>
                            {getStatusText(project.status)}
                          </Badge>
                        </div>
                        <p className="text-gray-400 font-mono text-sm truncate">{project.description}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Active Project Details */}
                {activeProject && (
                  <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader>
                      <CardTitle className="font-mono text-lg text-white">Project Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-mono font-bold text-white mb-1">{activeProject.title}</h4>
                        <p className="text-gray-400 font-mono text-sm">{activeProject.description}</p>
                      </div>
                      
                      {activeProject.budget && (
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-green-500" />
                          <span className="font-mono text-green-500">
                            ${parseFloat(activeProject.budget).toLocaleString()}
                          </span>
                        </div>
                      )}
                      
                      {activeProject.startDate && (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-blue-500" />
                          <span className="font-mono text-white text-sm">
                            Started {new Date(activeProject.startDate).toLocaleDateString()}
                          </span>
                        </div>
                      )}

                      <div className="pt-2 space-y-2">
                        <Button
                          onClick={() => window.location.href = `/projects/${activeProject.id}/files`}
                          variant="outline"
                          className="w-full bg-transparent border-zinc-700 text-white hover:bg-zinc-800 font-mono justify-start"
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          View Files
                        </Button>
                        
                        <Button
                          onClick={() => window.location.href = `/projects/${activeProject.id}/contracts`}
                          variant="outline"
                          className="w-full bg-transparent border-zinc-700 text-white hover:bg-zinc-800 font-mono justify-start"
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          Contracts
                        </Button>
                        
                        <Button
                          onClick={() => window.location.href = `/projects/${activeProject.id}/invoices`}
                          variant="outline"
                          className="w-full bg-transparent border-zinc-700 text-white hover:bg-zinc-800 font-mono justify-start"
                        >
                          <DollarSign className="w-4 h-4 mr-2" />
                          Invoices
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </motion.div>

              {/* Right Column - Communication & Actions */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="lg:col-span-2"
              >
                
                {activeProject ? (
                  <Card className="bg-zinc-900 border-zinc-800 h-[600px] flex flex-col">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="font-mono text-lg text-white flex items-center">
                          <MessageCircle className="w-5 h-5 mr-2" />
                          Project Communication
                        </CardTitle>
                        <Badge variant="outline" className="font-mono">
                          {messages.length} messages
                        </Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="flex-1 p-0">
                      <div className="h-full">
                        <AppleMessaging
                          projectId={activeProject.id.toString()}
                          messages={(messages || []).map(msg => ({
                            id: msg.id,
                            senderId: msg.senderId,
                            message: msg.message,
                            createdAt: msg.createdAt || new Date(),
                            replyTo: msg.replyTo || undefined
                          }))}
                          currentUserId={user?.id || ""}
                          isAdmin={false}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="bg-zinc-900 border-zinc-800 h-[600px] flex items-center justify-center">
                    <CardContent className="text-center">
                      <MessageCircle className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                      <h3 className="text-xl font-mono font-bold text-white mb-2">Select a Project</h3>
                      <p className="text-gray-400 font-mono">
                        Choose a project from the left to view details and communicate with the team
                      </p>
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
}