import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppUser as useAuth } from "@/hooks/use-app-user";
import { motion } from "framer-motion";
import { Clock, MessageCircle, CheckCircle, DollarSign, User, LogOut, AlertCircle, RefreshCw, Mail, Phone, Edit, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { LoadingPage, LoadingCard } from "@/components/ui/loading-spinner";
import { ErrorBoundary } from "@/components/error-boundary";
import ProjectRequestDialog from "@/components/project-request-dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Project } from "@/types";

export default function Dashboard() {
  const { user, authError, refetchAuth, logout, updateProfile } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [profileOpen, setProfileOpen] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);
  
  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (updates: any) => {
      return updateProfile(updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/me"] });
      setProfileOpen(false);
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    },
  });

  // Support form mutation
  const supportMutation = useMutation({
    mutationFn: async (supportData: any) => {
      const res = await apiRequest("POST", "/api/support", supportData);
      return res.json();
    },
    onSuccess: () => {
      setSupportOpen(false);
      toast({
        title: "Success",
        description: "Support request sent successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send support request",
        variant: "destructive",
      });
    },
  });
  
  const { data: projects = [], isLoading, isSuccess: projectsLoaded, error, refetch } = useQuery<Project[]>({
    queryKey: ["/api/my-projects"],
    retry: (failureCount, error) => {
      if (error?.message?.includes("401") || error?.message?.includes("403")) {
        return false;
      }
      return failureCount < 2;
    },
  });

  // Handle errors separately using useEffect for better error management
  if (error && !error.message.includes("401")) {
    console.error("Failed to load projects:", error);
  }

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

  if (isLoading) {
    return <LoadingPage message="Loading your dashboard..." />;
  }

  // Handle authentication errors
  if (authError) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <Card className="bg-gray-900 border-gray-700 max-w-md">
          <CardContent className="pt-6">
            <Alert className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-gray-300">
                Authentication error. Please try logging in again.
              </AlertDescription>
            </Alert>
            <div className="flex space-x-3">
              <Button onClick={() => refetchAuth()} className="flex-1 bg-white text-black">
                <RefreshCw className="w-4 h-4 mr-2" />
                Retry
              </Button>
              <Button 
                onClick={() => window.location.href = "/sign-in"}
                variant="outline" 
                className="flex-1 border-gray-600 text-white"
              >
                Sign In Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Handle project loading errors
  if (error && !error.message.includes("401")) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navigation />
        <div className="pt-24 pb-16">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-md mx-auto"
            >
              <Card className="bg-gray-900 border-gray-700">
                <CardContent className="pt-6">
                  <Alert className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-white">
                      Failed to load your projects. Please check your connection and try again.
                    </AlertDescription>
                  </Alert>
                  <div className="flex space-x-3">
                    <Button onClick={() => refetch()} className="flex-1 bg-white text-black">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Try Again
                    </Button>
                    <Button 
                      onClick={() => window.location.href = "/"}
                      variant="outline" 
                      className="flex-1 border-gray-600 text-white"
                    >
                      Go Home
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white" data-testid={projectsLoaded ? "legacy-projects-loaded" : undefined}>
      <Navigation />
      
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="flex justify-between items-start mb-8">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  Welcome back, {user?.firstName || "Client"}
                </h1>
                <p className="text-white/60 text-lg">
                  Track your projects and communicate with the team
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 bg-zinc-900 px-4 py-2 rounded-lg">
                  <User className="w-4 h-4" />
                  <span className="text-sm">{user?.email}</span>
                </div>
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

          {/* Projects Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {projects.length === 0 ? (
              <Card className="bg-white/5 border-white/10 text-center py-12">
                <CardContent className="pt-6">
                  <MessageCircle className="w-16 h-16 text-white mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2 text-white">No Projects Yet</h3>
                  <p className="text-white mb-6">
                    When you start working with us, your projects will appear here.
                  </p>
                  <ProjectRequestDialog>
                    <Button className="bg-white text-black hover:bg-gray-200">
                      Start a Project
                    </Button>
                  </ProjectRequestDialog>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project: any, index: number) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <Card className="bg-white/5 border-white/10 hover:border-white/10 transition-colors cursor-pointer h-full">
                      <CardHeader>
                        <div className="flex justify-between items-start mb-2">
                          <CardTitle className="text-lg">{project.title}</CardTitle>
                          <Badge 
                            className={`${getStatusColor(project.status)} text-white text-xs`}
                          >
                            {getStatusText(project.status)}
                          </Badge>
                        </div>
                        <CardDescription className="text-white">
                          {project.description}
                        </CardDescription>
                      </CardHeader>
                      
                      <CardContent>
                        <div className="space-y-3">
                          {project.budget && (
                            <div className="flex items-center space-x-2">
                              <DollarSign className="w-4 h-4 text-green-500" />
                              <span className="text-sm text-green-500">
                                ${parseFloat(project.budget).toLocaleString()}
                              </span>
                            </div>
                          )}
                          
                          {project.startDate && (
                            <div className="flex items-center space-x-2">
                              <Clock className="w-4 h-4 text-blue-500" />
                              <span className="text-sm text-white">
                                Started {new Date(project.startDate).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                          
                          <Button
                            onClick={() => window.location.href = `/projects/${project.id}`}
                            className="w-full bg-white text-black hover:bg-gray-200 mt-4"
                          >
                            <MessageCircle className="w-4 h-4 mr-2" />
                            View Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-12"
          >
            <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <ProjectRequestDialog>
                <Card className="bg-white/5 border-white/10 hover:border-white/10 transition-colors cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <MessageCircle className="w-8 h-8 text-blue-500 mx-auto mb-3" />
                    <h3 className="font-bold mb-2 text-white">New Project</h3>
                    <p className="text-white text-sm">Start a new project with us</p>
                  </CardContent>
                </Card>
              </ProjectRequestDialog>
              
              <Card 
                className="bg-white/5 border-white/10 hover:border-white/10 transition-colors cursor-pointer"
                onClick={() => {
                  if (projects.length > 0) {
                    window.location.href = `/project/${projects[0].id}`;
                  } else {
                    toast({
                      title: "No Projects",
                      description: "You don't have any active projects yet. Start by creating a new project!",
                      variant: "default",
                    });
                  }
                }}
              >
                <CardContent className="p-6 text-center">
                  <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-3" />
                  <h3 className="font-bold mb-2 text-white">View Progress</h3>
                  <p className="text-white text-sm">Check project milestones</p>
                </CardContent>
              </Card>
              
              <Dialog open={profileOpen} onOpenChange={setProfileOpen}>
                <DialogTrigger asChild>
                  <Card className="bg-white/5 border-white/10 hover:border-white/10 transition-colors cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <User className="w-8 h-8 text-purple-500 mx-auto mb-3" />
                      <h3 className="font-bold mb-2 text-white">Profile</h3>
                      <p className="text-white text-sm">Update your information</p>
                    </CardContent>
                  </Card>
                </DialogTrigger>
                <DialogContent className="bg-black border-white/20 text-white max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-xl">Edit Profile</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    updateProfileMutation.mutate({
                      firstName: formData.get("firstName"),
                      lastName: formData.get("lastName"),
                      email: formData.get("email"),
                    });
                  }} className="space-y-4">
                    <div>
                      <Label className="text-sm text-gray-300 block mb-2">First Name</Label>
                      <Input
                        type="text"
                        name="firstName"
                        defaultValue={user?.firstName || ''}
                        className="w-full p-3 bg-transparent border border-white/20 rounded text-white focus:border-white/40 focus:outline-none"
                      />
                    </div>
                    <div>
                      <Label className="text-sm text-gray-300 block mb-2">Last Name</Label>
                      <Input
                        type="text"
                        name="lastName"
                        defaultValue={user?.lastName || ''}
                        className="w-full p-3 bg-transparent border border-white/20 rounded text-white focus:border-white/40 focus:outline-none"
                      />
                    </div>
                    <div>
                      <Label className="text-sm text-gray-300 block mb-2">Email</Label>
                      <Input
                        type="email"
                        name="email"
                        defaultValue={user?.email || ''}
                        className="w-full p-3 bg-transparent border border-white/20 rounded text-white focus:border-white/40 focus:outline-none"
                        required
                      />
                    </div>
                    <div className="flex gap-3 pt-4">
                      <Button
                        type="submit"
                        disabled={updateProfileMutation.isPending}
                        className="flex-1 bg-white text-black hover:bg-gray-200"
                      >
                        {updateProfileMutation.isPending ? "Updating..." : "Update Profile"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setProfileOpen(false)}
                        className="bg-transparent border-white/20 text-white hover:bg-white/10"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
              
              <Dialog open={supportOpen} onOpenChange={setSupportOpen}>
                <DialogTrigger asChild>
                  <Card className="bg-white/5 border-white/10 hover:border-white/10 transition-colors cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <HelpCircle className="w-8 h-8 text-yellow-500 mx-auto mb-3" />
                      <h3 className="font-bold mb-2 text-white">Support</h3>
                      <p className="text-white text-sm">Get help or ask questions</p>
                    </CardContent>
                  </Card>
                </DialogTrigger>
                <DialogContent className="bg-black border-white/20 text-white max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-xl">Contact Support</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    supportMutation.mutate({
                      subject: formData.get("subject"),
                      message: formData.get("message"),
                      priority: formData.get("priority"),
                    });
                  }} className="space-y-4">
                    <div>
                      <Label className="text-sm text-gray-300 block mb-2">Subject</Label>
                      <Input
                        type="text"
                        name="subject"
                        placeholder="Brief description of your issue"
                        className="w-full p-3 bg-transparent border border-white/20 rounded text-white focus:border-white/40 focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <Label className="text-sm text-gray-300 block mb-2">Priority</Label>
                      <select
                        name="priority"
                        className="w-full p-3 bg-black border border-white/20 rounded text-white focus:border-white/40 focus:outline-none"
                      >
                        <option value="low">Low - General question</option>
                        <option value="medium">Medium - Project related</option>
                        <option value="high">High - Urgent issue</option>
                      </select>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-300 block mb-2">Message</Label>
                      <Textarea
                        name="message"
                        placeholder="Describe your issue or question in detail..."
                        className="w-full p-3 bg-transparent border border-white/20 rounded text-white focus:border-white/40 focus:outline-none min-h-[120px]"
                        required
                      />
                    </div>
                    <div className="flex gap-3 pt-4">
                      <Button
                        type="submit"
                        disabled={supportMutation.isPending}
                        className="flex-1 bg-white text-black hover:bg-gray-200"
                      >
                        {supportMutation.isPending ? "Sending..." : "Send Support Request"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setSupportOpen(false)}
                        className="bg-transparent border-white/20 text-white hover:bg-white/10"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <p className="text-sm text-white/60 mb-2">Or contact us directly:</p>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-300">
                        <Mail className="w-4 h-4 inline mr-2" />
                        info@landonco.co
                      </p>
                      <p className="text-sm text-gray-300">
                        <Phone className="w-4 h-4 inline mr-2" />
                        (940) 389-2685
                      </p>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}