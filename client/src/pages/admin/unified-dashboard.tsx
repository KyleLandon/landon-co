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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FolderOpen, 
  Users, 
  MessageSquare, 
  DollarSign, 
  TrendingUp,
  Send,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  User
} from "lucide-react";
import AdminLayout from "./admin-layout";
import AppleMessaging from "@/components/apple-messaging";
import type { Project, User as UserType, Message, Contact } from "@shared/schema";

export default function UnifiedAdminDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch all admin data
  const { data: projects = [] } = useQuery<Project[]>({
    queryKey: ["/api/admin/projects"],
    refetchInterval: 5000,
  });

  const { data: clients = [] } = useQuery<UserType[]>({
    queryKey: ["/api/admin/users"],
    refetchInterval: 10000,
  });

  const { data: contacts = [] } = useQuery<Contact[]>({
    queryKey: ["/api/admin/contacts"],
    refetchInterval: 10000,
  });

  const { data: messages = [] } = useQuery<Message[]>({
    queryKey: [`/api/projects/${selectedProjectId}/messages`],
    enabled: !!selectedProjectId,
    refetchInterval: 3000,
  });

  // Quick project update mutation
  const updateProjectMutation = useMutation({
    mutationFn: async ({ projectId, updates }: { projectId: number, updates: any }) => {
      return apiRequest("PATCH", `/api/projects/${projectId}`, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/projects"] });
      toast({ title: "Project updated successfully" });
    },
    onError: () => {
      toast({ title: "Failed to update project", variant: "destructive" });
    },
  });

  // Send quick message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async ({ projectId, message }: { projectId: string, message: string }) => {
      return apiRequest("POST", `/api/projects/${projectId}/messages`, { message });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/projects/${selectedProjectId}/messages`] });
      toast({ title: "Message sent successfully" });
    },
    onError: () => {
      toast({ title: "Failed to send message", variant: "destructive" });
    },
  });

  // Filter projects
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Get project stats
  const projectStats = {
    total: projects.length,
    active: projects.filter(p => p.status === "active").length,
    completed: projects.filter(p => p.status === "completed").length,
    pending: projects.filter(p => p.status === "pending").length,
    revenue: projects.reduce((sum, p) => sum + (parseFloat(p.budget || "0") || 0), 0)
  };

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
      case "active": return "Active";
      case "proposal": return "Proposal";
      case "completed": return "Completed";
      case "pending": return "Pending";
      case "inquiry": return "Inquiry";
      default: return status;
    }
  };

  const selectedProject = selectedProjectId 
    ? projects.find(p => p.id.toString() === selectedProjectId)
    : null;

  const selectedClient = selectedProject 
    ? clients.find(c => c.id === selectedProject.clientId)
    : null;

  return (
    <AdminLayout>
      <div className="space-y-6">
        
        {/* Header with Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 font-mono text-sm">Total Projects</p>
                  <p className="text-2xl font-mono font-bold text-white">{projectStats.total}</p>
                </div>
                <FolderOpen className="w-6 h-6 text-blue-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 font-mono text-sm">Active Projects</p>
                  <p className="text-2xl font-mono font-bold text-white">{projectStats.active}</p>
                </div>
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 font-mono text-sm">Total Clients</p>
                  <p className="text-2xl font-mono font-bold text-white">{clients.length}</p>
                </div>
                <Users className="w-6 h-6 text-purple-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 font-mono text-sm">Revenue</p>
                  <p className="text-2xl font-mono font-bold text-white">
                    ${projectStats.revenue.toLocaleString()}
                  </p>
                </div>
                <DollarSign className="w-6 h-6 text-yellow-400" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column - Projects & Filters */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1 space-y-4"
          >
            
            {/* Search and Filter */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader className="pb-3">
                <CardTitle className="font-mono text-lg text-white">Projects</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search projects..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-transparent border-gray-700 text-white font-mono"
                  />
                </div>
                
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="bg-transparent border-gray-700 text-white font-mono">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-700 text-white">
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="proposal">Proposal</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="inquiry">Inquiry</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
            
            {/* Projects List */}
            <Card className="bg-gray-900 border-gray-800 max-h-[500px] overflow-y-auto">
              <CardContent className="p-3 space-y-2">
                {filteredProjects.map((project) => (
                  <div
                    key={project.id}
                    onClick={() => setSelectedProjectId(project.id.toString())}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedProject?.id === project.id 
                        ? 'bg-white/10 border border-white/20' 
                        : 'hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-mono font-bold text-white text-sm truncate">
                        {project.title}
                      </h4>
                      <Badge className={`${getStatusColor(project.status)} text-white text-xs`}>
                        {getStatusText(project.status)}
                      </Badge>
                    </div>
                    <p className="text-gray-400 font-mono text-xs truncate">
                      {project.description}
                    </p>
                    {project.budget && (
                      <p className="text-green-400 font-mono text-xs mt-1">
                        ${parseFloat(project.budget).toLocaleString()}
                      </p>
                    )}
                  </div>
                ))}
                
                {filteredProjects.length === 0 && (
                  <div className="text-center py-8">
                    <FolderOpen className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                    <p className="text-gray-400 font-mono text-sm">No projects found</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Right Column - Project Details & Communication */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            
            {selectedProject ? (
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList className="bg-gray-900 border border-gray-800">
                  <TabsTrigger value="overview" className="font-mono">Overview</TabsTrigger>
                  <TabsTrigger value="messages" className="font-mono">Messages</TabsTrigger>
                  <TabsTrigger value="edit" className="font-mono">Edit</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="space-y-4">
                  <Card className="bg-gray-900 border-gray-800">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="font-mono text-lg text-white">
                          {selectedProject.title}
                        </CardTitle>
                        <Badge className={`${getStatusColor(selectedProject.status)} text-white`}>
                          {getStatusText(selectedProject.status)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-gray-300 font-mono">{selectedProject.description}</p>
                      
                      {selectedClient && (
                        <div className="bg-gray-800 p-4 rounded-lg">
                          <h4 className="font-mono font-bold text-white mb-2 flex items-center">
                            <User className="w-4 h-4 mr-2" />
                            Client Information
                          </h4>
                          <p className="text-gray-300 font-mono text-sm">
                            {selectedClient.firstName} {selectedClient.lastName}
                          </p>
                          <p className="text-gray-400 font-mono text-sm">{selectedClient.email}</p>
                        </div>
                      )}
                      
                      <div className="grid grid-cols-2 gap-4">
                        {selectedProject.budget && (
                          <div className="bg-gray-800 p-3 rounded-lg">
                            <p className="text-gray-400 font-mono text-sm">Budget</p>
                            <p className="text-green-400 font-mono font-bold">
                              ${parseFloat(selectedProject.budget).toLocaleString()}
                            </p>
                          </div>
                        )}
                        
                        {selectedProject.startDate && (
                          <div className="bg-gray-800 p-3 rounded-lg">
                            <p className="text-gray-400 font-mono text-sm">Start Date</p>
                            <p className="text-white font-mono">
                              {new Date(selectedProject.startDate).toLocaleDateString()}
                            </p>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          onClick={() => window.location.href = `/admin/projects/${selectedProject.id}/files`}
                          variant="outline"
                          size="sm"
                          className="bg-transparent border-gray-700 text-white hover:bg-gray-800 font-mono"
                        >
                          View Files
                        </Button>
                        <Button
                          onClick={() => window.location.href = `/admin/projects/${selectedProject.id}/contracts`}
                          variant="outline"
                          size="sm"
                          className="bg-transparent border-gray-700 text-white hover:bg-gray-800 font-mono"
                        >
                          Contracts
                        </Button>
                        <Button
                          onClick={() => window.location.href = `/admin/projects/${selectedProject.id}/invoices`}
                          variant="outline"
                          size="sm"
                          className="bg-transparent border-gray-700 text-white hover:bg-gray-800 font-mono"
                        >
                          Invoices
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="messages">
                  <Card className="bg-gray-900 border-gray-800 h-[600px] flex flex-col">
                    <CardHeader>
                      <CardTitle className="font-mono text-lg text-white flex items-center">
                        <MessageSquare className="w-5 h-5 mr-2" />
                        Project Communication
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 p-0">
                      <div className="h-full">
                        <AppleMessaging
                          projectId={selectedProject.id.toString()}
                          messages={(messages || []).map(msg => ({
                            id: msg.id,
                            senderId: msg.senderId,
                            message: msg.message,
                            createdAt: msg.createdAt || new Date(),
                            replyTo: msg.replyTo || undefined
                          }))}
                          currentUserId={user?.id || ""}
                          isAdmin={true}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="edit">
                  <Card className="bg-gray-900 border-gray-800">
                    <CardHeader>
                      <CardTitle className="font-mono text-lg text-white flex items-center">
                        <Edit className="w-5 h-5 mr-2" />
                        Quick Edit Project
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="text-gray-400 font-mono text-sm mb-2 block">Status</label>
                        <Select
                          value={selectedProject.status}
                          onValueChange={(status) => 
                            updateProjectMutation.mutate({
                              projectId: selectedProject.id,
                              updates: { status }
                            })
                          }
                        >
                          <SelectTrigger className="bg-transparent border-gray-700 text-white font-mono">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-900 border-gray-700 text-white">
                            <SelectItem value="inquiry">Inquiry</SelectItem>
                            <SelectItem value="proposal">Proposal</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <label className="text-gray-400 font-mono text-sm mb-2 block">Budget</label>
                        <Input
                          type="number"
                          defaultValue={selectedProject.budget || ""}
                          placeholder="Project budget"
                          className="bg-transparent border-gray-700 text-white font-mono"
                          onBlur={(e) => {
                            if (e.target.value !== selectedProject.budget) {
                              updateProjectMutation.mutate({
                                projectId: selectedProject.id,
                                updates: { budget: e.target.value }
                              });
                            }
                          }}
                        />
                      </div>
                      
                      <div>
                        <label className="text-gray-400 font-mono text-sm mb-2 block">End Date</label>
                        <Input
                          type="date"
                          defaultValue={selectedProject.endDate ? 
                            (typeof selectedProject.endDate === 'string' ? 
                              selectedProject.endDate : 
                              selectedProject.endDate.toISOString().split('T')[0]
                            ) : ""}
                          className="bg-transparent border-gray-700 text-white font-mono"
                          onBlur={(e) => {
                            const currentValue = selectedProject.endDate ? 
                              (typeof selectedProject.endDate === 'string' ? 
                                selectedProject.endDate : 
                                selectedProject.endDate.toISOString().split('T')[0]
                              ) : "";
                            if (e.target.value !== currentValue) {
                              updateProjectMutation.mutate({
                                projectId: selectedProject.id,
                                updates: { endDate: e.target.value || null }
                              });
                            }
                          }}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            ) : (
              <Card className="bg-gray-900 border-gray-800 h-[600px] flex items-center justify-center">
                <CardContent className="text-center">
                  <FolderOpen className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-xl font-mono font-bold text-white mb-2">Select a Project</h3>
                  <p className="text-gray-400 font-mono">
                    Choose a project from the left to view details and manage communication
                  </p>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>
      </div>
    </AdminLayout>
  );
}