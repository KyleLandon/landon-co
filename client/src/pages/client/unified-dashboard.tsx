import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { useAppUser as useAuth } from "@/hooks/use-app-user";
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
import type { Project, Message, ProjectFile, Contract, Invoice } from "@shared/schema";

// Files Tab Component
function FilesTab({ projectId }: { projectId: string }) {
  const { data: files = [], isLoading } = useQuery<ProjectFile[]>({
    queryKey: [`/api/projects/${projectId}/files`],
    enabled: !!projectId,
  });

  if (isLoading) {
    return <div className="text-center text-white/60 py-8">Loading files...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg text-white">Project Files</h3>
        <span className="text-sm text-white/60">{files.length} files</span>
      </div>
      
      {files.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-white/50 mx-auto mb-4" />
          <p className="text-white/60">No files uploaded yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {files.map((file) => (
            <div key={file.id} className="bg-zinc-800 p-4 rounded-lg border border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-white/60" />
                  <div>
                    <h4 className="text-white">{file.originalName}</h4>
                    <p className="text-sm text-white/60">{file.description || "No description"}</p>
                  </div>
                </div>
                <Button
                  onClick={() => window.open(`/api/files/${file.id}/download`, '_blank')}
                  variant="outline"
                  size="sm"
                  className="bg-transparent border-zinc-600 text-white hover:bg-white/10"
                >
                  <Download className="w-4 h-4 mr-1" />
                  Download
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Contracts Tab Component
function ContractsTab({ projectId }: { projectId: string }) {
  const { data: contracts = [], isLoading } = useQuery<Contract[]>({
    queryKey: [`/api/projects/${projectId}/contracts`],
    enabled: !!projectId,
  });

  if (isLoading) {
    return <div className="text-center text-white/60 py-8">Loading contracts...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg text-white">Project Contracts</h3>
        <span className="text-sm text-white/60">{contracts.length} contracts</span>
      </div>
      
      {contracts.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-white/50 mx-auto mb-4" />
          <p className="text-white/60">No contracts available</p>
        </div>
      ) : (
        <div className="space-y-3">
          {contracts.map((contract) => (
            <div key={contract.id} className="bg-zinc-800 p-4 rounded-lg border border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-white/60" />
                  <div>
                    <h4 className="text-white">{contract.title}</h4>
                    <p className="text-sm text-white/60">Status: {contract.status}</p>
                  </div>
                </div>
                <Button
                  onClick={() => window.open(`/projects/${projectId}/contracts/${contract.id}`, '_blank')}
                  variant="outline"
                  size="sm"
                  className="bg-transparent border-zinc-600 text-white hover:bg-white/10"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  View
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Invoices Tab Component
function InvoicesTab({ projectId }: { projectId: string }) {
  const { data: invoices = [], isLoading } = useQuery<Invoice[]>({
    queryKey: [`/api/projects/${projectId}/invoices`],
    enabled: !!projectId,
  });

  if (isLoading) {
    return <div className="text-center text-white/60 py-8">Loading invoices...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg text-white">Project Invoices</h3>
        <span className="text-sm text-white/60">{invoices.length} invoices</span>
      </div>
      
      {invoices.length === 0 ? (
        <div className="text-center py-12">
          <DollarSign className="w-16 h-16 text-white/50 mx-auto mb-4" />
          <p className="text-white/60">No invoices available</p>
        </div>
      ) : (
        <div className="space-y-3">
          {invoices.map((invoice) => (
            <div key={invoice.id} className="bg-zinc-800 p-4 rounded-lg border border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <DollarSign className="w-5 h-5 text-white/60" />
                  <div>
                    <h4 className="text-white">Invoice #{invoice.invoiceNumber}</h4>
                    <p className="text-sm text-white/60">
                      ${invoice.totalAmount} - {invoice.status}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => window.open(`/projects/${projectId}/invoices/${invoice.id}`, '_blank')}
                  variant="outline"
                  size="sm"
                  className="bg-transparent border-zinc-600 text-white hover:bg-white/10"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  View
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function UnifiedDashboard() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [activeTab, setActiveTab] = useState<'communication' | 'files' | 'contracts' | 'invoices'>('communication');

  // Fetch user's projects
  const { data: projects = [], isLoading: projectsLoading, isSuccess: projectsLoaded, error: projectsError } = useQuery<Project[]>({
    queryKey: ["/api/my-projects"],
    refetchInterval: 5000, // Auto-refresh every 5 seconds
  });

  // Auto-select project on load: use cached selection or newest project
  useEffect(() => {
    if (projects.length > 0 && !selectedProjectId) {
      // Try to restore cached selection
      const cachedProjectId = localStorage.getItem('selectedProjectId');
      const cachedProjectExists = cachedProjectId && projects.some(p => p.id.toString() === cachedProjectId);
      
      if (cachedProjectExists) {
        setSelectedProjectId(cachedProjectId);
      } else {
        // Select the newest project (highest ID or most recent createdAt)
        const newestProject = projects.reduce((newest, current) => {
          if (!newest) return current;
          // Compare by ID (assuming higher ID = newer) or createdAt if available
          return current.id > newest.id ? current : newest;
        });
        setSelectedProjectId(newestProject.id.toString());
      }
    }
  }, [projects, selectedProjectId]);

  // Cache selected project in localStorage
  useEffect(() => {
    if (selectedProjectId) {
      localStorage.setItem('selectedProjectId', selectedProjectId);
    }
  }, [selectedProjectId]);

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
          <p className="text-white/60">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (projectsError) {
    return <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-4">
      <h1>Unable to load your projects</h1>
      <p>Please try again or contact support.</p>
      <Button onClick={() => void logout()}>Log out</Button>
    </div>;
  }

  return (
    <div className="min-h-screen bg-black text-white" data-testid={projectsLoaded ? "client-projects-loaded" : undefined}>
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
                <h1 className="text-3xl font-bold mb-2">
                  Welcome back, {user?.firstName || "Client"}
                </h1>
                <p className="text-white/60">
                  Everything you need in one place
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <ProjectRequestDialog>
                  <Button className="bg-white text-black hover:bg-gray-200">
                    <Plus className="w-4 h-4 mr-2" />
                    New Project
                  </Button>
                </ProjectRequestDialog>
                
                <Button
                  onClick={() => void logout()}
                  variant="outline"
                  size="sm"
                  className="bg-transparent border-white/10 text-white hover:bg-white/5"
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
              <Card className="bg-white/5 border-white/10 text-center py-16">
                <CardContent>
                  <MessageCircle className="w-20 h-20 text-white mx-auto mb-6" />
                  <h3 className="text-2xl font-bold mb-4 text-white">Ready to Start?</h3>
                  <p className="text-white/60 mb-8 max-w-md mx-auto">
                    Let's bring your ideas to life. Start by telling us about your project.
                  </p>
                  <ProjectRequestDialog>
                    <Button size="lg" className="bg-white text-black hover:bg-gray-200">
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
                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-lg text-white">Your Projects</CardTitle>
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
                          <h4 className="font-bold text-white truncate">{project.title}</h4>
                          <Badge className={`${getStatusColor(project.status)} text-white text-xs`}>
                            {getStatusText(project.status)}
                          </Badge>
                        </div>
                        <p className="text-white/60 text-sm truncate">{project.description}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Active Project Details */}
                {activeProject && (
                  <Card className="bg-white/5 border-white/10">
                    <CardHeader>
                      <CardTitle className="text-lg text-white">Project Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-bold text-white mb-1">{activeProject.title}</h4>
                        <p className="text-white/60 text-sm">{activeProject.description}</p>
                      </div>
                      
                      {activeProject.budget && (
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-green-500" />
                          <span className="text-green-500">
                            ${parseFloat(activeProject.budget).toLocaleString()}
                          </span>
                        </div>
                      )}
                      
                      {activeProject.startDate && (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-blue-500" />
                          <span className="text-white text-sm">
                            Started {new Date(activeProject.startDate).toLocaleDateString()}
                          </span>
                        </div>
                      )}

                      <div className="pt-2 space-y-2">
                        <Button
                          onClick={() => setActiveTab('files')}
                          variant={activeTab === 'files' ? 'default' : 'outline'}
                          className={`w-full justify-start ${
                            activeTab === 'files' 
                              ? 'bg-white text-black hover:bg-gray-200' 
                              : 'bg-transparent border-white/10 text-white hover:bg-white/5'
                          }`}
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          View Files
                        </Button>
                        
                        <Button
                          onClick={() => setActiveTab('contracts')}
                          variant={activeTab === 'contracts' ? 'default' : 'outline'}
                          className={`w-full justify-start ${
                            activeTab === 'contracts' 
                              ? 'bg-white text-black hover:bg-gray-200' 
                              : 'bg-transparent border-white/10 text-white hover:bg-white/5'
                          }`}
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          Contracts
                        </Button>
                        
                        <Button
                          onClick={() => setActiveTab('invoices')}
                          variant={activeTab === 'invoices' ? 'default' : 'outline'}
                          className={`w-full justify-start ${
                            activeTab === 'invoices' 
                              ? 'bg-white text-black hover:bg-gray-200' 
                              : 'bg-transparent border-white/10 text-white hover:bg-white/5'
                          }`}
                        >
                          <DollarSign className="w-4 h-4 mr-2" />
                          Invoices
                        </Button>
                        
                        <Button
                          onClick={() => setActiveTab('communication')}
                          variant={activeTab === 'communication' ? 'default' : 'outline'}
                          className={`w-full justify-start ${
                            activeTab === 'communication' 
                              ? 'bg-white text-black hover:bg-gray-200' 
                              : 'bg-transparent border-white/10 text-white hover:bg-white/5'
                          }`}
                        >
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Messages
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
                  <Card className="bg-white/5 border-white/10 h-[600px] flex flex-col">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg text-white flex items-center">
                          {activeTab === 'communication' && <><MessageCircle className="w-5 h-5 mr-2" />Project Communication</>}
                          {activeTab === 'files' && <><FileText className="w-5 h-5 mr-2" />Project Files</>}
                          {activeTab === 'contracts' && <><FileText className="w-5 h-5 mr-2" />Contracts</>}
                          {activeTab === 'invoices' && <><DollarSign className="w-5 h-5 mr-2" />Invoices</>}
                        </CardTitle>
                        {activeTab === 'communication' && (
                          <Badge variant="outline">
                            {messages.length} messages
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    
                    <CardContent className="flex-1 p-0 overflow-hidden">
                      <div className="h-full max-h-[500px]">
                        {activeTab === 'communication' && (
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
                        )}
                        
                        {activeTab === 'files' && (
                          <div className="h-full p-6 overflow-y-auto">
                            <FilesTab projectId={activeProject.id.toString()} />
                          </div>
                        )}
                        
                        {activeTab === 'contracts' && (
                          <div className="h-full p-6 overflow-y-auto">
                            <ContractsTab projectId={activeProject.id.toString()} />
                          </div>
                        )}
                        
                        {activeTab === 'invoices' && (
                          <div className="h-full p-6 overflow-y-auto">
                            <InvoicesTab projectId={activeProject.id.toString()} />
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="bg-white/5 border-white/10 h-[600px] flex items-center justify-center">
                    <CardContent className="text-center">
                      <MessageCircle className="w-16 h-16 text-white/50 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-white mb-2">Select a Project</h3>
                      <p className="text-white/60">
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