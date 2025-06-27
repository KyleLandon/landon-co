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
import AdvancedMessaging from "@/components/advanced-messaging";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import type { Project, Message, ProjectUpdate } from "@/types";

export default function ProjectDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    status: "",
    budget: "",
    startDate: "",
    endDate: ""
  });
  const projectId = parseInt(id || "0");

  const { data: project, isLoading: projectLoading } = useQuery<Project>({
    queryKey: [`/api/projects/${id}`],
    enabled: !!id,
  });

  const { data: messages = [], isLoading: messagesLoading, refetch: refetchMessages } = useQuery<Message[]>({
    queryKey: [`/api/projects/${id}/messages`],
    enabled: !!id,
  });

  // WebSocket connection for real-time messaging (temporarily disabled during development)
  // const { joinProject } = useWebSocket({
  //   onMessage: (data) => {
  //     if (data.type === 'message-received') {
  //       queryClient.invalidateQueries({ queryKey: [`/api/projects/${id}/messages`] });
  //       setTimeout(() => {
  //         messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  //       }, 100);
  //     }
  //   },
  //   onConnect: () => {
  //     console.log('Connected to WebSocket');
  //     if (projectId) {
  //       joinProject(projectId);
  //     }
  //   }
  // });

  // Auto-refetch messages every 3 seconds for real-time effect (temporary solution)
  useEffect(() => {
    const interval = setInterval(() => {
      queryClient.invalidateQueries({ queryKey: [`/api/projects/${id}/messages`] });
    }, 3000);
    
    return () => clearInterval(interval);
  }, [id, queryClient]);

  const { data: updates = [], isLoading: updatesLoading } = useQuery<ProjectUpdate[]>({
    queryKey: [`/api/projects/${id}/updates`],
    enabled: !!id,
  });



  const updateProjectMutation = useMutation({
    mutationFn: async (updates: any) => {
      const res = await apiRequest("PUT", `/api/admin/projects/${id}`, updates);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/projects/${id}`] });
      setIsEditing(false);
      toast({
        title: "Project updated",
        description: "Project details have been updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update project",
        variant: "destructive",
      });
    },
  });

  // Populate edit form when project data loads
  useEffect(() => {
    if (project && !isEditing) {
      setEditForm({
        title: project.title || "",
        description: project.description || "",
        status: project.status || "",
        budget: project.budget ? project.budget.toString() : "",
        startDate: project.startDate ? new Date(project.startDate).toISOString().split('T')[0] : "",
        endDate: project.endDate ? new Date(project.endDate).toISOString().split('T')[0] : ""
      });
    }
  }, [project, isEditing]);



  const handleStartEdit = () => {
    if (project) {
      setEditForm({
        title: project.title || "",
        description: project.description || "",
        status: project.status || "",
        budget: project.budget ? project.budget.toString() : "",
        startDate: project.startDate ? new Date(project.startDate).toISOString().split('T')[0] : "",
        endDate: project.endDate ? new Date(project.endDate).toISOString().split('T')[0] : ""
      });
      setIsEditing(true);
    }
  };

  const handleSaveEdit = () => {
    const updates: any = {
      title: editForm.title,
      description: editForm.description,
      status: editForm.status,
    };
    
    if (editForm.budget) {
      updates.budget = parseFloat(editForm.budget);
    }
    
    if (editForm.startDate) {
      updates.startDate = new Date(editForm.startDate).toISOString();
    }
    
    if (editForm.endDate) {
      updates.endDate = new Date(editForm.endDate).toISOString();
    }
    
    updateProjectMutation.mutate(updates);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    // Reset form to current project values
    if (project) {
      setEditForm({
        title: project.title || "",
        description: project.description || "",
        status: project.status || "",
        budget: project.budget ? project.budget.toString() : "",
        startDate: project.startDate ? new Date(project.startDate).toISOString().split('T')[0] : "",
        endDate: project.endDate ? new Date(project.endDate).toISOString().split('T')[0] : ""
      });
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
      {/* Simplified Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center">
              <img 
                src="/attached_assets/white_transparent_1750909506258.png" 
                alt="Landon & Co." 
                className="h-8 w-auto object-contain"
              />
            </div>
            
            {/* User Menu */}
            <div className="flex items-center">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-black" />
              </div>
            </div>
          </div>
        </div>
      </nav>
      
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
            
            {isEditing ? (
              // Edit Mode
              <div className="space-y-6 bg-gray-900 border border-gray-700 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-mono font-bold text-white">Edit Project</h2>
                  <div className="flex gap-2">
                    <Button 
                      onClick={handleSaveEdit}
                      disabled={updateProjectMutation.isPending}
                      className="bg-green-600 text-white hover:bg-green-700 font-mono"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {updateProjectMutation.isPending ? "Saving..." : "Save"}
                    </Button>
                    <Button 
                      onClick={handleCancelEdit}
                      variant="outline"
                      className="bg-transparent border-white/20 text-white hover:bg-white/10 font-mono"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-mono text-gray-300 block mb-2">Project Title</Label>
                    <Input
                      value={editForm.title}
                      onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                      className="bg-black border-gray-600 text-white font-mono"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-sm font-mono text-gray-300 block mb-2">Status</Label>
                    <Select 
                      value={editForm.status} 
                      onValueChange={(value) => setEditForm(prev => ({ ...prev, status: value }))}
                    >
                      <SelectTrigger className="bg-black border-gray-600 text-white font-mono">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-black border-gray-600 text-white">
                        <SelectItem value="inquiry">Initial Inquiry</SelectItem>
                        <SelectItem value="proposal">Proposal</SelectItem>
                        <SelectItem value="active">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="md:col-span-2">
                    <Label className="text-sm font-mono text-gray-300 block mb-2">Description</Label>
                    <Textarea
                      value={editForm.description}
                      onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                      className="bg-black border-gray-600 text-white font-mono min-h-[80px]"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-sm font-mono text-gray-300 block mb-2">Budget</Label>
                    <Input
                      type="number"
                      value={editForm.budget}
                      onChange={(e) => setEditForm(prev => ({ ...prev, budget: e.target.value }))}
                      className="bg-black border-gray-600 text-white font-mono"
                      placeholder="0.00"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-sm font-mono text-gray-300 block mb-2">Start Date</Label>
                    <Input
                      type="date"
                      value={editForm.startDate}
                      onChange={(e) => setEditForm(prev => ({ ...prev, startDate: e.target.value }))}
                      className="bg-black border-gray-600 text-white font-mono"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-sm font-mono text-gray-300 block mb-2">End Date</Label>
                    <Input
                      type="date"
                      value={editForm.endDate}
                      onChange={(e) => setEditForm(prev => ({ ...prev, endDate: e.target.value }))}
                      className="bg-black border-gray-600 text-white font-mono"
                    />
                  </div>
                </div>
              </div>
            ) : (
              // View Mode
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-4xl font-mono font-bold mb-2">{project.title}</h1>
                  <p className="text-gray-400 font-mono">{project.description}</p>
                </div>
                <div className="flex items-center gap-3">
                  {user?.role === "admin" && (
                    <Button 
                      onClick={handleStartEdit}
                      variant="outline"
                      className="bg-transparent border-blue-500 text-blue-400 hover:bg-blue-500/10 font-mono"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Project
                    </Button>
                  )}
                  <Badge className={`${getStatusColor(project.status)} text-white font-mono`}>
                    {getStatusText(project.status)}
                  </Badge>
                </div>
              </div>
            )}
          </motion.div>

          {/* Project Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          >
            <Card className="bg-black border-white/20">
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

            <Card className="bg-black border-white/20">
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
              <Card className="bg-black border-white/20">
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
              <Card className="bg-black border-white/20">
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
              <Card className="bg-black border-white/20">
                <CardHeader>
                  <CardTitle className="font-mono text-white">Messages</CardTitle>
                  <CardDescription className="text-gray-400">
                    Communication with the development team
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="h-96">
                    <AdvancedMessaging
                      projectId={id || ""}
                      messages={messages}
                      currentUserId={user?.id || ""}
                      isAdmin={user?.role === "admin"}
                    />
                  </div>
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