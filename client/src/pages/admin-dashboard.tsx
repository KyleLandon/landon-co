import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { Clock, MessageCircle, CheckCircle, DollarSign, User, Plus, Settings, Mail, Phone } from "lucide-react";
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

export default function AdminDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newProjectOpen, setNewProjectOpen] = useState(false);
  
  // Fetch all data
  const { data: projects = [], isLoading: projectsLoading } = useQuery({
    queryKey: ["/api/admin/projects"],
  });

  const { data: contacts = [], isLoading: contactsLoading } = useQuery({
    queryKey: ["/api/admin/contacts"],
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

  if (projectsLoading || contactsLoading) {
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
            <h1 className="text-4xl font-mono font-bold mb-2">Admin Dashboard</h1>
            <p className="text-gray-400 font-mono">Welcome back, {user?.firstName}</p>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-mono text-gray-400">Active Projects</CardTitle>
                <Clock className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-mono font-bold text-white">{activeProjects}</div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-mono text-gray-400">Total Projects</CardTitle>
                <CheckCircle className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-mono font-bold text-white">{projects.length}</div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-mono text-gray-400">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-mono font-bold text-white">
                  ${totalRevenue.toLocaleString()}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-mono text-gray-400">New Contacts</CardTitle>
                <MessageCircle className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-mono font-bold text-white">{pendingContacts}</div>
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
              <DialogContent className="bg-gray-900 border-gray-700 text-white">
                <DialogHeader>
                  <DialogTitle className="font-mono">Create New Project</DialogTitle>
                  <DialogDescription className="text-gray-400">
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
                        placeholder="Enter client ID"
                        className="bg-black border-gray-700"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="title" className="font-mono">Project Title</Label>
                      <Input
                        id="title"
                        name="title"
                        placeholder="Enter project title"
                        className="bg-black border-gray-700"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="description" className="font-mono">Description</Label>
                      <Textarea
                        id="description"
                        name="description"
                        placeholder="Enter project description"
                        className="bg-black border-gray-700"
                      />
                    </div>
                    <div>
                      <Label htmlFor="status" className="font-mono">Status</Label>
                      <Select name="status" defaultValue="inquiry">
                        <SelectTrigger className="bg-black border-gray-700">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="inquiry">Initial Inquiry</SelectItem>
                          <SelectItem value="proposal">Proposal</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
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
                        className="bg-black border-gray-700"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" disabled={createProjectMutation.isPending}>
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

            {/* Recent Contacts */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="font-mono text-white">Recent Contacts</CardTitle>
                  <CardDescription className="text-gray-400">
                    New inquiries and messages
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {contacts.slice(0, 10).map((contact: any) => (
                      <div key={contact.id} className="border-l-4 border-gray-700 pl-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-mono font-medium text-white">{contact.name}</h4>
                          <span className="text-xs text-gray-400 font-mono">
                            {new Date(contact.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="space-y-1 text-sm text-gray-400 font-mono">
                          <div className="flex items-center">
                            <Mail className="w-3 h-3 mr-2" />
                            {contact.email}
                          </div>
                          {contact.phone && (
                            <div className="flex items-center">
                              <Phone className="w-3 h-3 mr-2" />
                              {contact.phone}
                            </div>
                          )}
                          <p className="mt-2 text-gray-300">{contact.message}</p>
                        </div>
                      </div>
                    ))}
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