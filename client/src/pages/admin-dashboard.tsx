import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { Clock, MessageCircle, CheckCircle, DollarSign, User, Plus, Settings, Mail, Phone, Filter, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import type { Project, Contact } from "@/types";

export default function AdminDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newProjectOpen, setNewProjectOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingUser, setEditingUser] = useState<any>(null);
  const [userToDelete, setUserToDelete] = useState<any>(null);
  const [userSearchTerm, setUserSearchTerm] = useState("");
  
  // Fetch all data
  const { data: projects = [], isLoading: projectsLoading } = useQuery<Project[]>({
    queryKey: ["/api/admin/projects"],
  });

  const { data: contacts = [], isLoading: contactsLoading } = useQuery<Contact[]>({
    queryKey: ["/api/admin/contacts"],
  });

  const { data: projectSubmissions = [], isLoading: submissionsLoading } = useQuery<any[]>({
    queryKey: ["/api/admin/project-submissions"],
  });

  const { data: users = [], isLoading: usersLoading } = useQuery<any[]>({
    queryKey: ["/api/admin/users"],
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
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create project",
        variant: "destructive",
      });
    },
  });

  // User management mutations
  const updateUserMutation = useMutation({
    mutationFn: async ({ userId, updates }: { userId: string; updates: any }) => {
      const res = await apiRequest("PUT", `/api/admin/users/${userId}`, updates);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      setEditingUser(null);
      toast({
        title: "Success",
        description: "User updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update user",
        variant: "destructive",
      });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      const res = await apiRequest("DELETE", `/api/admin/users/${userId}`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      setUserToDelete(null);
      toast({
        title: "Success",
        description: "User deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete user",
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

  const createProjectFromContact = (contact: any) => {
    // Extract project type and budget from the contact message/project field
    const projectTitle = contact.project || `Project for ${contact.name}`;
    const description = `Project request from ${contact.name}:\n\n${contact.message}`;
    
    createProjectMutation.mutate({
      clientId: contact.email, // Use email as client identifier
      title: projectTitle,
      description: description,
      status: "inquiry", // Start as inquiry status
      budget: contact.budget || undefined,
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
      case "active": return "In Progress";
      case "proposal": return "Proposal";
      case "completed": return "Completed";
      case "pending": return "Pending Review";
      case "inquiry": return "Initial Inquiry";
      default: return status;
    }
  };

  if (projectsLoading || contactsLoading || submissionsLoading || usersLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white font-mono">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  const activeProjects = projects.filter((p: any) => p.status === "active").length;
  const totalRevenue = projects.reduce((sum: number, p: any) => sum + (parseFloat(p.budget) || 0), 0);
  const pendingContacts = contacts.filter((c: any) => !c.responded).length;
  const pendingSubmissions = Array.isArray(projectSubmissions) ? projectSubmissions.filter((s: any) => s.status === "pending").length : 0;

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
            <h1 className="text-4xl font-mono font-bold mb-2 text-white">Admin Dashboard</h1>
            <p className="text-gray-400 font-mono">Welcome back, {user?.firstName}</p>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            <Card className="bg-zinc-900 border-gray-800">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-mono text-white">Active Projects</CardTitle>
                <Clock className="h-4 w-4 text-white" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-mono font-bold text-white">{activeProjects}</div>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900 border-gray-800">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-mono text-white">Total Projects</CardTitle>
                <CheckCircle className="h-4 w-4 text-white" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-mono font-bold text-white">{projects.length}</div>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900 border-gray-800">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-mono text-white">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-white" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-mono font-bold text-white">
                  ${totalRevenue.toLocaleString()}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900 border-gray-800">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-mono text-white">Pending Submissions</CardTitle>
                <MessageCircle className="h-4 w-4 text-white" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-mono font-bold text-white">{pendingSubmissions}</div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex gap-4 mb-8"
          >
            <Dialog open={newProjectOpen} onOpenChange={setNewProjectOpen}>
              <DialogTrigger asChild>
                <Button className="bg-white text-black hover:bg-gray-200 font-mono">
                  <Plus className="w-4 h-4 mr-2" />
                  New Project
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-black border-gray-800 text-white">
                <DialogHeader>
                  <DialogTitle className="font-mono text-white">Create New Project</DialogTitle>
                  <DialogDescription className="text-gray-400 font-mono">
                    Add a new project for a client.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateProject}>
                  <div className="grid gap-4 py-4">
                    <div>
                      <Label htmlFor="clientId" className="font-mono">Client ID</Label>
                      <Input
                        id="clientId"
                        name="clientId"
                        placeholder="Enter client ID or email"
                        className="bg-zinc-900 border-gray-700 text-white font-mono"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="title" className="font-mono">Project Title</Label>
                      <Input
                        id="title"
                        name="title"
                        placeholder="Enter project title"
                        className="bg-zinc-900 border-gray-700 text-white font-mono"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="description" className="font-mono">Description</Label>
                      <Textarea
                        id="description"
                        name="description"
                        placeholder="Enter project description"
                        className="bg-zinc-900 border-gray-700 text-white font-mono"
                      />
                    </div>
                    <div>
                      <Label htmlFor="status" className="font-mono">Status</Label>
                      <Select name="status" defaultValue="inquiry">
                        <SelectTrigger className="bg-zinc-900 border-gray-700 text-white font-mono">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-gray-700">
                          <SelectItem value="inquiry" className="font-mono text-white hover:text-black">Initial Inquiry</SelectItem>
                          <SelectItem value="proposal" className="font-mono text-white hover:text-black">Proposal</SelectItem>
                          <SelectItem value="active" className="font-mono text-white hover:text-black">Active</SelectItem>
                          <SelectItem value="completed" className="font-mono text-white hover:text-black">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="budget" className="font-mono">Budget</Label>
                      <Input
                        id="budget"
                        name="budget"
                        type="number"
                        step="0.01"
                        placeholder="Enter budget"
                        className="bg-zinc-900 border-gray-700 text-white font-mono"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" disabled={createProjectMutation.isPending} className="bg-white text-black hover:bg-gray-200 font-mono">
                      {createProjectMutation.isPending ? "Creating..." : "Create Project"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </motion.div>

          {/* Projects and Contacts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Projects */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="font-mono text-white">Recent Projects</CardTitle>
                  <CardDescription className="text-gray-400">
                    Latest project updates and status
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {projects.slice(0, 10).map((project: any) => (
                      <div key={project.id} className="border-l-4 border-gray-700 pl-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-mono font-medium text-white">{project.title}</h4>
                          <Badge className={`${getStatusColor(project.status)} text-white font-mono text-xs`}>
                            {getStatusText(project.status)}
                          </Badge>
                        </div>
                        <p className="text-gray-400 text-sm font-mono mb-2">
                          Client: {project.clientId}
                        </p>
                        {project.budget && (
                          <p className="text-green-400 font-mono text-sm">
                            ${parseFloat(project.budget).toLocaleString()}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Project Requests Management */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="bg-zinc-900 border-gray-800">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="font-mono text-white">Project Requests</CardTitle>
                      <CardDescription className="text-gray-400 font-mono">
                        Manage incoming project requests and convert to projects
                      </CardDescription>
                    </div>
                    <Badge className="bg-white text-black font-mono">
                      {contacts.length} total
                    </Badge>
                  </div>
                  
                  {/* Filters and Search */}
                  <div className="flex gap-4 mt-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          placeholder="Search by name, email, or project type..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 bg-zinc-800 border-gray-700 text-white font-mono"
                        />
                      </div>
                    </div>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="w-48 bg-zinc-800 border-gray-700 text-white font-mono">
                        <Filter className="w-4 h-4 mr-2" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-gray-700 text-white">
                        <SelectItem value="all" className="font-mono text-white">All Requests</SelectItem>
                        <SelectItem value="unresponded" className="font-mono text-white">Unresponded</SelectItem>
                        <SelectItem value="responded" className="font-mono text-white">Responded</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {contacts
                      .filter((contact: any) => {
                        const matchesSearch = searchTerm === "" || 
                          contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          contact.project?.toLowerCase().includes(searchTerm.toLowerCase());
                        
                        const matchesFilter = filterStatus === "all" || 
                          (filterStatus === "unresponded" && !contact.responded) ||
                          (filterStatus === "responded" && contact.responded);
                        
                        return matchesSearch && matchesFilter;
                      })
                      .map((contact: any) => (
                      <div key={contact.id} className="border border-gray-700 rounded-lg p-4 hover:border-gray-600 transition-colors">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-3">
                            <h4 className="font-mono font-medium text-white">{contact.name}</h4>
                            <Badge 
                              variant={contact.responded ? "default" : "secondary"}
                              className={`font-mono text-xs ${
                                contact.responded 
                                  ? "bg-green-500 text-white" 
                                  : "bg-gray-600 text-white"
                              }`}
                            >
                              {contact.responded ? "Responded" : "New"}
                            </Badge>
                          </div>
                          <div className="text-right">
                            <span className="text-xs text-gray-400 font-mono block">
                              {new Date(contact.createdAt).toLocaleDateString()}
                            </span>
                            <span className="text-xs text-gray-500 font-mono">
                              ID: {contact.id}
                            </span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                          <div className="space-y-2">
                            <div className="flex items-center text-sm text-gray-400 font-mono">
                              <Mail className="w-3 h-3 mr-2" />
                              {contact.email}
                            </div>
                            {contact.phone && (
                              <div className="flex items-center text-sm text-gray-400 font-mono">
                                <Phone className="w-3 h-3 mr-2" />
                                {contact.phone}
                              </div>
                            )}
                          </div>
                          
                          <div className="space-y-2">
                            {contact.project && (
                              <div className="text-sm font-mono">
                                <span className="text-gray-400">Project Type: </span>
                                <span className="text-white">{contact.project}</span>
                              </div>
                            )}
                            {contact.budget && (
                              <div className="text-sm font-mono">
                                <span className="text-gray-400">Budget: </span>
                                <span className="text-white">{contact.budget}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-300 font-mono mb-3 line-clamp-2">
                          {contact.message}
                        </p>
                        
                        <div className="flex justify-between items-center">
                          <Button
                            size="sm"
                            className="bg-white text-black hover:bg-gray-200 font-mono"
                            onClick={() => {
                              // Create project directly using contact data
                              createProjectFromContact(contact);
                            }}
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Create Project
                          </Button>
                          
                          <div className="text-xs text-gray-500 font-mono">
                            Client Email: {contact.email}
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {contacts.length === 0 && (
                      <div className="text-center py-8">
                        <MessageCircle className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                        <p className="text-gray-400 font-mono">No project requests yet</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* User Management Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Card className="bg-black border-white/10 border-2">
                <CardHeader className="border-b border-white/10 pb-4">
                  <CardTitle className="text-white font-mono text-xl">User Management</CardTitle>
                  {/* User Search */}
                  <div className="flex items-center gap-4 mt-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Search users by email or name..."
                        value={userSearchTerm}
                        onChange={(e) => setUserSearchTerm(e.target.value)}
                        className="pl-10 bg-transparent border-white/20 text-white font-mono focus:border-white/40"
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="text-left py-3 px-4 text-white font-mono">ID</th>
                          <th className="text-left py-3 px-4 text-white font-mono">Email</th>
                          <th className="text-left py-3 px-4 text-white font-mono">Name</th>
                          <th className="text-left py-3 px-4 text-white font-mono">Created</th>
                          <th className="text-left py-3 px-4 text-white font-mono">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users
                          .filter((user: any) => 
                            userSearchTerm === "" || 
                            user.email?.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
                            `${user.firstName || ''} ${user.lastName || ''}`.toLowerCase().includes(userSearchTerm.toLowerCase())
                          )
                          .map((user: any) => (
                          <tr key={user.id} className="border-b border-white/5 hover:bg-white/5">
                            <td className="py-3 px-4 text-gray-300 font-mono text-sm">{user.id}</td>
                            <td className="py-3 px-4 text-gray-300 font-mono text-sm">{user.email}</td>
                            <td className="py-3 px-4 text-gray-300 font-mono text-sm">
                              {user.firstName} {user.lastName}
                            </td>
                            <td className="py-3 px-4 text-gray-300 font-mono text-sm">
                              {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="bg-transparent border-blue-500 text-blue-400 hover:bg-blue-500/10 font-mono text-xs"
                                  onClick={() => setEditingUser(user)}
                                >
                                  Edit
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="bg-transparent border-red-500 text-red-400 hover:bg-red-500/10 font-mono text-xs"
                                  onClick={() => setUserToDelete(user)}
                                >
                                  Delete
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    
                    {users.length === 0 && (
                      <div className="text-center py-8">
                        <p className="text-gray-400 font-mono">No users found</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Edit User Dialog */}
      {editingUser && (
        <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
          <DialogContent className="bg-black border-white/20 text-white max-w-md">
            <DialogHeader>
              <DialogTitle className="font-mono text-xl">Edit User</DialogTitle>
            </DialogHeader>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              updateUserMutation.mutate({
                userId: editingUser.id,
                updates: {
                  email: formData.get("email"),
                  firstName: formData.get("firstName"),
                  lastName: formData.get("lastName"),
                }
              });
            }} className="space-y-4">
              <div>
                <label className="text-sm font-mono text-gray-300 block mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  defaultValue={editingUser.email}
                  className="w-full p-3 bg-transparent border border-white/20 rounded text-white font-mono focus:border-white/40 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-mono text-gray-300 block mb-2">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  defaultValue={editingUser.firstName || ''}
                  className="w-full p-3 bg-transparent border border-white/20 rounded text-white font-mono focus:border-white/40 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-sm font-mono text-gray-300 block mb-2">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  defaultValue={editingUser.lastName || ''}
                  className="w-full p-3 bg-transparent border border-white/20 rounded text-white font-mono focus:border-white/40 focus:outline-none"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={updateUserMutation.isPending}
                  className="flex-1 bg-white text-black hover:bg-gray-200 font-mono"
                >
                  {updateUserMutation.isPending ? "Updating..." : "Update User"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingUser(null)}
                  className="bg-transparent border-white/20 text-white hover:bg-white/10 font-mono"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete User Confirmation Dialog */}
      {userToDelete && (
        <Dialog open={!!userToDelete} onOpenChange={() => setUserToDelete(null)}>
          <DialogContent className="bg-black border-white/20 text-white max-w-md">
            <DialogHeader>
              <DialogTitle className="font-mono text-xl">Delete User</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p className="text-gray-300 font-mono mb-4">
                Are you sure you want to delete user "{userToDelete.email}"? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <Button
                  onClick={() => deleteUserMutation.mutate(userToDelete.id)}
                  disabled={deleteUserMutation.isPending}
                  className="flex-1 bg-red-600 text-white hover:bg-red-700 font-mono"
                >
                  {deleteUserMutation.isPending ? "Deleting..." : "Delete User"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setUserToDelete(null)}
                  className="bg-transparent border-white/20 text-white hover:bg-white/10 font-mono"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      <Footer />
    </div>
  );
}