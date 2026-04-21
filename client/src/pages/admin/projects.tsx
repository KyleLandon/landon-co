import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Search, Filter, Edit, Trash2, Plus, Clock, DollarSign, User, FolderOpen } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import AdminLayout from "./admin-layout";

export default function AdminProjects() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [editingProject, setEditingProject] = useState<any>(null);
  const [newProjectOpen, setNewProjectOpen] = useState(false);

  // Fetch projects
  const { data: projects = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/admin/projects"],
  });

  // Create project mutation
  const createProjectMutation = useMutation({
    mutationFn: async (projectData: any) => {
      const res = await apiRequest("POST", "/api/admin/projects", projectData);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/projects"] });
      setNewProjectOpen(false);
      toast({
        title: "Success",
        description: "Project created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create project",
        variant: "destructive",
      });
    },
  });

  // Update project mutation
  const updateProjectMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: any }) => {
      const res = await apiRequest("PUT", `/api/admin/projects/${id}`, updates);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/projects"] });
      setEditingProject(null);
      toast({
        title: "Success",
        description: "Project updated successfully",
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

  const handleCreateProject = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    createProjectMutation.mutate({
      clientId: formData.get("clientId"),
      title: formData.get("title"),
      description: formData.get("description"),
      status: formData.get("status"),
      budget: formData.get("budget") ? parseFloat(formData.get("budget") as string) : undefined,
    });
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

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.clientId?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || project.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white/60">Loading projects...</p>
          </div>
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
            <h1 className="text-3xl font-bold text-white">Projects</h1>
            <p className="text-white/60 mt-1">Manage all client projects</p>
          </div>
          <Dialog open={newProjectOpen} onOpenChange={setNewProjectOpen}>
            <DialogTrigger asChild>
              <Button className="bg-white text-black hover:bg-gray-200">
                <Plus className="w-4 h-4 mr-2" />
                New Project
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-md">
              <DialogHeader>
                <DialogTitle className="text-xl">Create New Project</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateProject} className="space-y-4">
                <div>
                  <Label className="text-sm text-gray-300 block mb-2">Client ID</Label>
                  <Input
                    name="clientId"
                    placeholder="Enter client ID or email"
                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded text-white focus:border-gray-600 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <Label className="text-sm text-gray-300 block mb-2">Project Title</Label>
                  <Input
                    name="title"
                    placeholder="Enter project title"
                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded text-white focus:border-gray-600 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <Label className="text-sm text-gray-300 block mb-2">Description</Label>
                  <Textarea
                    name="description"
                    placeholder="Project description"
                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded text-white focus:border-gray-600 focus:outline-none min-h-[100px]"
                    required
                  />
                </div>
                <div>
                  <Label className="text-sm text-gray-300 block mb-2">Status</Label>
                  <select
                    name="status"
                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded text-white focus:border-gray-600 focus:outline-none"
                  >
                    <option value="inquiry">Inquiry</option>
                    <option value="proposal">Proposal</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
                <div>
                  <Label className="text-sm text-gray-300 block mb-2">Budget (optional)</Label>
                  <Input
                    name="budget"
                    type="number"
                    placeholder="0.00"
                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded text-white focus:border-gray-600 focus:outline-none"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    disabled={createProjectMutation.isPending}
                    className="flex-1 bg-white text-black hover:bg-gray-200"
                  >
                    {createProjectMutation.isPending ? "Creating..." : "Create Project"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setNewProjectOpen(false)}
                    className="bg-transparent border-gray-700 text-white hover:bg-gray-800"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4" />
            <Input
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-800 border-gray-700 text-white focus:border-gray-600"
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-48 bg-gray-800 border-gray-700 text-white">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-gray-800 text-white">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="inquiry">Inquiry</SelectItem>
              <SelectItem value="proposal">Proposal</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProjects.map((project: any) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="bg-gray-900 border-gray-800 border-2 hover:border-gray-700 transition-colors">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-white text-lg">{project.title}</CardTitle>
                    <Badge className={`${getStatusColor(project.status)} text-white text-xs`}>
                      {getStatusText(project.status)}
                    </Badge>
                  </div>
                  <p className="text-white/50 text-sm">Client: {project.clientId}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                    {project.description}
                  </p>
                  
                  <div className="space-y-2 mb-4">
                    {project.budget && (
                      <div className="flex items-center text-green-400 text-sm">
                        <DollarSign className="w-4 h-4 mr-2" />
                        ${parseFloat(project.budget).toLocaleString()}
                      </div>
                    )}
                    {project.createdAt && (
                      <div className="flex items-center text-blue-400 text-sm">
                        <Clock className="w-4 h-4 mr-2" />
                        {new Date(project.createdAt).toLocaleDateString()}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 bg-transparent border-gray-600 text-white/60 hover:bg-gray-800 text-xs"
                      onClick={() => setEditingProject(project)}
                    >
                      <Edit className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-transparent border-gray-600 text-white/60 hover:bg-gray-800 text-xs"
                      onClick={() => window.location.href = `/admin/projects/${project.id}`}
                    >
                      View
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <FolderOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl text-white mb-2">No Projects Found</h3>
            <p className="text-white/60 mb-4">
              {searchTerm || filterStatus !== "all" ? "Try adjusting your filters" : "Create your first project to get started"}
            </p>
          </div>
        )}
      </div>

      {/* Edit Project Dialog */}
      {editingProject && (
        <Dialog open={!!editingProject} onOpenChange={() => setEditingProject(null)}>
          <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl">Edit Project</DialogTitle>
            </DialogHeader>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              updateProjectMutation.mutate({
                id: editingProject.id,
                updates: {
                  title: formData.get("title"),
                  description: formData.get("description"),
                  status: formData.get("status"),
                  budget: formData.get("budget") ? parseFloat(formData.get("budget") as string) : undefined,
                }
              });
            }} className="space-y-4">
              <div>
                <Label className="text-sm text-gray-300 block mb-2">Project Title</Label>
                <Input
                  name="title"
                  defaultValue={editingProject.title}
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded text-white focus:border-gray-600 focus:outline-none"
                  required
                />
              </div>
              <div>
                <Label className="text-sm text-gray-300 block mb-2">Description</Label>
                <Textarea
                  name="description"
                  defaultValue={editingProject.description}
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded text-white focus:border-gray-600 focus:outline-none min-h-[100px]"
                  required
                />
              </div>
              <div>
                <Label className="text-sm text-gray-300 block mb-2">Status</Label>
                <select
                  name="status"
                  defaultValue={editingProject.status}
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded text-white focus:border-gray-600 focus:outline-none"
                >
                  <option value="inquiry">Inquiry</option>
                  <option value="proposal">Proposal</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
              <div>
                <Label className="text-sm text-gray-300 block mb-2">Budget</Label>
                <Input
                  name="budget"
                  type="number"
                  defaultValue={editingProject.budget || ''}
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded text-white focus:border-gray-600 focus:outline-none"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={updateProjectMutation.isPending}
                  className="flex-1 bg-white text-black hover:bg-gray-200"
                >
                  {updateProjectMutation.isPending ? "Updating..." : "Update Project"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingProject(null)}
                  className="bg-transparent border-gray-700 text-white hover:bg-gray-800"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </AdminLayout>
  );
}