import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { Clock, MessageCircle, CheckCircle, DollarSign, User, LogOut, AlertCircle, RefreshCw, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { LoadingPage, LoadingCard } from "@/components/ui/loading-spinner";
import { ErrorBoundary } from "@/components/error-boundary";
import { useToast } from "@/hooks/use-toast";
import type { Project } from "@/types";

export default function Dashboard() {
  const { user, authError, refetchAuth } = useAuth();
  const { toast } = useToast();
  
  const { data: projects = [], isLoading, error, refetch } = useQuery<Project[]>({
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
              <Button onClick={() => refetchAuth()} className="flex-1 bg-white text-black font-mono">
                <RefreshCw className="w-4 h-4 mr-2" />
                Retry
              </Button>
              <Button 
                onClick={() => window.location.href = "/api/login"}
                variant="outline" 
                className="flex-1 border-gray-600 text-white font-mono"
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
                    <AlertDescription className="text-gray-300">
                      Failed to load your projects. Please check your connection and try again.
                    </AlertDescription>
                  </Alert>
                  <div className="flex space-x-3">
                    <Button onClick={() => refetch()} className="flex-1 bg-white text-black font-mono">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Try Again
                    </Button>
                    <Button 
                      onClick={() => window.location.href = "/"}
                      variant="outline" 
                      className="flex-1 border-gray-600 text-white font-mono"
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
    <div className="min-h-screen bg-black text-white">
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
                <h1 className="text-4xl md:text-5xl font-mono font-bold mb-4">
                  Welcome back, {user?.firstName || "Client"}
                </h1>
                <p className="text-gray-400 font-mono text-lg">
                  Track your projects and communicate with the team
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 bg-zinc-900 px-4 py-2 rounded-lg">
                  <User className="w-4 h-4" />
                  <span className="font-mono text-sm">{user?.email}</span>
                </div>
                <Button
                  onClick={() => window.location.href = "/api/logout"}
                  variant="outline"
                  size="sm"
                  className="bg-transparent border-zinc-700 text-white hover:bg-zinc-800"
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
              <Card className="bg-zinc-900 border-zinc-800 text-center py-12">
                <CardContent className="pt-6">
                  <MessageCircle className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-xl font-mono font-bold mb-2">No Projects Yet</h3>
                  <p className="text-gray-400 font-mono mb-6">
                    When you start working with us, your projects will appear here.
                  </p>
                  <Button
                    onClick={() => window.location.href = "/#work-together"}
                    className="bg-white text-black hover:bg-gray-200 font-mono"
                  >
                    Start a Project
                  </Button>
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
                    <Card className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors cursor-pointer h-full">
                      <CardHeader>
                        <div className="flex justify-between items-start mb-2">
                          <CardTitle className="font-mono text-lg">{project.title}</CardTitle>
                          <Badge 
                            className={`${getStatusColor(project.status)} text-white font-mono text-xs`}
                          >
                            {getStatusText(project.status)}
                          </Badge>
                        </div>
                        <CardDescription className="font-mono text-gray-400">
                          {project.description}
                        </CardDescription>
                      </CardHeader>
                      
                      <CardContent>
                        <div className="space-y-3">
                          {project.budget && (
                            <div className="flex items-center space-x-2">
                              <DollarSign className="w-4 h-4 text-green-500" />
                              <span className="font-mono text-sm text-green-500">
                                ${parseFloat(project.budget).toLocaleString()}
                              </span>
                            </div>
                          )}
                          
                          {project.startDate && (
                            <div className="flex items-center space-x-2">
                              <Clock className="w-4 h-4 text-blue-500" />
                              <span className="font-mono text-sm text-gray-400">
                                Started {new Date(project.startDate).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                          
                          <Button
                            onClick={() => window.location.href = `/project/${project.id}`}
                            className="w-full bg-white text-black hover:bg-gray-200 font-mono mt-4"
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
            <h2 className="text-2xl font-mono font-bold mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors cursor-pointer">
                <CardContent className="p-6 text-center">
                  <MessageCircle className="w-8 h-8 text-blue-500 mx-auto mb-3" />
                  <h3 className="font-mono font-bold mb-2">New Project</h3>
                  <p className="text-gray-400 font-mono text-sm">Start a new project with us</p>
                </CardContent>
              </Card>
              
              <Card className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors cursor-pointer">
                <CardContent className="p-6 text-center">
                  <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-3" />
                  <h3 className="font-mono font-bold mb-2">View Progress</h3>
                  <p className="text-gray-400 font-mono text-sm">Check project milestones</p>
                </CardContent>
              </Card>
              
              <Card className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors cursor-pointer">
                <CardContent className="p-6 text-center">
                  <User className="w-8 h-8 text-purple-500 mx-auto mb-3" />
                  <h3 className="font-mono font-bold mb-2">Profile</h3>
                  <p className="text-gray-400 font-mono text-sm">Update your information</p>
                </CardContent>
              </Card>
              
              <Card className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors cursor-pointer">
                <CardContent className="p-6 text-center">
                  <MessageCircle className="w-8 h-8 text-yellow-500 mx-auto mb-3" />
                  <h3 className="font-mono font-bold mb-2">Support</h3>
                  <p className="text-gray-400 font-mono text-sm">Get help or ask questions</p>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}