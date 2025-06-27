import { useState, useEffect } from "react";
import { useParams, Link } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  Edit, 
  Save, 
  X, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  DollarSign, 
  Clock, 
  MessageCircle, 
  ArrowLeft, 
  Activity,
  FileText,
  Settings,
  Users,
  BarChart3,
  GitBranch
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import AdminLayout from "../admin-layout";
import type { Project, User as UserType } from "@shared/schema";

export default function AdminProjectDetail() {
  const { id } = useParams();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);

  // Debug log to confirm new component is loading
  console.log("NEW AdminProjectDetail component loaded for project ID:", id);

  const { data: project, isLoading: projectLoading } = useQuery<Project>({
    queryKey: [`/api/projects/${id}`],
    enabled: !!id,
  });

  const { data: client, isLoading: clientLoading } = useQuery<UserType>({
    queryKey: [`/api/users/${project?.clientId}`],
    enabled: !!project?.clientId,
  });

  const { data: messages, isLoading: messagesLoading } = useQuery<any[]>({
    queryKey: [`/api/projects/${id}/messages`],
    enabled: !!id,
  });

  const [editForm, setEditForm] = useState({
    title: project?.title || "",
    description: project?.description || "",
    status: project?.status || "inquiry",
    budget: project?.budget || "",
    startDate: project?.startDate ? new Date(project.startDate).toISOString().split('T')[0] : "",
    endDate: project?.endDate ? new Date(project.endDate).toISOString().split('T')[0] : "",
  });

  const updateProject = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest(`/api/projects/${id}`, "PATCH", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/projects/${id}`] });
      setIsEditing(false);
      toast({
        title: "Success",
        description: "Project updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    const data: any = {
      title: editForm.title,
      description: editForm.description,
      status: editForm.status,
      budget: editForm.budget,
    };

    if (editForm.startDate) {
      data.startDate = new Date(editForm.startDate).toISOString();
    }
    if (editForm.endDate) {
      data.endDate = new Date(editForm.endDate).toISOString();
    }

    updateProject.mutate(data);
  };

  // Update form when project data loads
  useEffect(() => {
    if (project) {
      setEditForm({
        title: project.title || "",
        description: project.description || "",
        status: project.status || "inquiry",
        budget: project.budget || "",
        startDate: project.startDate ? new Date(project.startDate).toISOString().split('T')[0] : "",
        endDate: project.endDate ? new Date(project.endDate).toISOString().split('T')[0] : "",
      });
    }
  }, [project]);

  if (projectLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-gray-400 font-mono">Loading project...</div>
        </div>
      </AdminLayout>
    );
  }

  if (!project) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-gray-400 font-mono">Project not found</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-950">
        {/* Header Section */}
        <div className="border-b border-gray-800 bg-gray-950 px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/admin/projects">
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white font-mono">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Projects
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-mono font-bold text-white">{project.title} ⭐ NEW DESIGN LOADED ⭐</h1>
                <p className="text-gray-400 font-mono text-sm mt-1">{project.description}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge 
                variant={project.status === "completed" ? "default" : project.status === "active" ? "secondary" : "outline"}
                className="font-mono text-sm"
              >
                {project.status?.toUpperCase()}
              </Badge>
              <Button
                onClick={() => setIsEditing(!isEditing)}
                variant="outline"
                size="sm"
                className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700 font-mono"
              >
                {isEditing ? <X className="w-4 h-4 mr-2" /> : <Edit className="w-4 h-4 mr-2" />}
                {isEditing ? "Cancel" : "Edit"}
              </Button>
              {isEditing && (
                <Button
                  onClick={handleSave}
                  disabled={updateProject.isPending}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 font-mono"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {updateProject.isPending ? "Saving..." : "Save"}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-6 py-6">
          {/* Quick Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <DollarSign className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-gray-400 font-mono text-xs">Budget</p>
                    <p className="text-white font-mono font-semibold">{project.budget || "TBD"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-500/20 rounded-lg">
                    <MessageCircle className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-gray-400 font-mono text-xs">Messages</p>
                    <p className="text-white font-mono font-semibold">{messages?.length || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <Activity className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-gray-400 font-mono text-xs">Status</p>
                    <p className="text-white font-mono font-semibold capitalize">{project.status}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-orange-500/20 rounded-lg">
                    <Clock className="w-5 h-5 text-orange-400" />
                  </div>
                  <div>
                    <p className="text-gray-400 font-mono text-xs">Created</p>
                    <p className="text-white font-mono font-semibold">
                      {project.createdAt ? new Date(project.createdAt).toLocaleDateString() : "Unknown"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-1 mb-6 border-b border-gray-800">
            <Link href={`/admin/projects/${id}`}>
              <Button variant="ghost" className="font-mono text-white border-b-2 border-blue-500 rounded-none">
                <FileText className="w-4 h-4 mr-2" />
                Overview
              </Button>
            </Link>
            <Link href={`/admin/projects/${id}/messages`}>
              <Button variant="ghost" className="font-mono text-gray-400 hover:text-white rounded-none">
                <MessageCircle className="w-4 h-4 mr-2" />
                Communication
              </Button>
            </Link>
            <Link href={`/admin/projects/${id}/timeline`}>
              <Button variant="ghost" className="font-mono text-gray-400 hover:text-white rounded-none">
                <GitBranch className="w-4 h-4 mr-2" />
                Timeline
              </Button>
            </Link>
            <Link href={`/admin/projects/${id}/files`}>
              <Button variant="ghost" className="font-mono text-gray-400 hover:text-white rounded-none">
                <Settings className="w-4 h-4 mr-2" />
                Files
              </Button>
            </Link>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Project Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Project Information */}
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white font-mono text-lg">Project Details</CardTitle>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="title" className="text-white font-mono text-sm">Project Title</Label>
                        <Input
                          id="title"
                          value={editForm.title}
                          onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                          className="bg-gray-800 border-gray-700 text-white font-mono mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="description" className="text-white font-mono text-sm">Description</Label>
                        <Textarea
                          id="description"
                          value={editForm.description}
                          onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                          className="bg-gray-800 border-gray-700 text-white font-mono mt-1 min-h-[120px]"
                          placeholder="Describe the project scope and requirements..."
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="status" className="text-white font-mono text-sm">Status</Label>
                          <Select value={editForm.status} onValueChange={(value) => setEditForm({ ...editForm, status: value })}>
                            <SelectTrigger className="bg-gray-800 border-gray-700 text-white font-mono mt-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 border-gray-700">
                              <SelectItem value="inquiry">Inquiry</SelectItem>
                              <SelectItem value="proposal">Proposal</SelectItem>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="budget" className="text-white font-mono text-sm">Budget</Label>
                          <Input
                            id="budget"
                            value={editForm.budget}
                            onChange={(e) => setEditForm({ ...editForm, budget: e.target.value })}
                            className="bg-gray-800 border-gray-700 text-white font-mono mt-1"
                            placeholder="$5,000"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="startDate" className="text-white font-mono text-sm">Start Date</Label>
                          <Input
                            id="startDate"
                            type="date"
                            value={editForm.startDate}
                            onChange={(e) => setEditForm({ ...editForm, startDate: e.target.value })}
                            className="bg-gray-800 border-gray-700 text-white font-mono mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="endDate" className="text-white font-mono text-sm">Target Completion</Label>
                          <Input
                            id="endDate"
                            type="date"
                            value={editForm.endDate}
                            onChange={(e) => setEditForm({ ...editForm, endDate: e.target.value })}
                            className="bg-gray-800 border-gray-700 text-white font-mono mt-1"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-white font-mono font-medium mb-2">Description</h3>
                        <p className="text-gray-300 font-mono text-sm leading-relaxed">
                          {project.description || "No description provided"}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <h4 className="text-gray-400 font-mono text-xs uppercase tracking-wide mb-2">Timeline</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-gray-400 font-mono text-sm">Start:</span>
                              <span className="text-white font-mono text-sm">
                                {project.startDate ? new Date(project.startDate).toLocaleDateString() : "TBD"}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400 font-mono text-sm">Target:</span>
                              <span className="text-white font-mono text-sm">
                                {project.endDate ? new Date(project.endDate).toLocaleDateString() : "TBD"}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="text-gray-400 font-mono text-xs uppercase tracking-wide mb-2">Project Info</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-gray-400 font-mono text-sm">Budget:</span>
                              <span className="text-white font-mono text-sm">{project.budget || "TBD"}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400 font-mono text-sm">Updated:</span>
                              <span className="text-white font-mono text-sm">
                                {project.updatedAt ? new Date(project.updatedAt).toLocaleDateString() : "Unknown"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recent Messages */}
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white font-mono text-lg">Recent Messages</CardTitle>
                    <Link href={`/admin/projects/${id}/messages`}>
                      <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300 font-mono">
                        View All
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  {messagesLoading ? (
                    <div className="text-gray-400 font-mono text-sm">Loading messages...</div>
                  ) : messages && messages.length > 0 ? (
                    <div className="space-y-3">
                      {messages.slice(0, 3).map((message: any) => (
                        <div key={message.id} className="p-4 bg-gray-800 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-400 font-mono">
                              {message.senderId === client?.id ? client?.firstName || "Client" : "Admin"}
                            </span>
                            <span className="text-xs text-gray-500 font-mono">
                              {message.createdAt ? new Date(message.createdAt).toLocaleDateString() : "Unknown"}
                            </span>
                          </div>
                          <p className="text-white font-mono text-sm">{message.message}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <MessageCircle className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                      <p className="text-gray-400 font-mono text-sm">No messages yet</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Client Info */}
            <div className="space-y-6">
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white font-mono text-lg">Client Information</CardTitle>
                </CardHeader>
                <CardContent>
                  {client ? (
                    <div className="space-y-4">
                      <div className="text-center">
                        {client.profileImageUrl ? (
                          <img
                            src={client.profileImageUrl}
                            alt={`${client.firstName} ${client.lastName}`}
                            className="w-16 h-16 rounded-full mx-auto object-cover border-2 border-gray-700"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center mx-auto border-2 border-gray-700">
                            <User className="w-8 h-8 text-gray-400" />
                          </div>
                        )}
                        <h3 className="text-white font-mono font-medium mt-3">
                          {client.firstName} {client.lastName}
                        </h3>
                        <p className="text-gray-400 font-mono text-sm">{client.email}</p>
                      </div>
                      
                      <div className="pt-4 border-t border-gray-800">
                        <div className="space-y-3">
                          <div className="flex items-center space-x-3">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-300 font-mono text-sm">{client.email}</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <User className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-300 font-mono text-sm">
                              Joined {client.createdAt ? new Date(client.createdAt).toLocaleDateString() : "Unknown"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : clientLoading ? (
                    <div className="text-gray-400 font-mono text-sm">Loading client info...</div>
                  ) : (
                    <div className="text-center py-8">
                      <Users className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                      <p className="text-gray-400 font-mono text-sm">Client not found</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white font-mono text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link href={`/admin/projects/${id}/messages`}>
                    <Button variant="outline" className="w-full font-mono bg-gray-800 border-gray-700 text-white hover:bg-gray-700">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Send Message
                    </Button>
                  </Link>
                  <Link href={`/admin/projects/${id}/timeline`}>
                    <Button variant="outline" className="w-full font-mono bg-gray-800 border-gray-700 text-white hover:bg-gray-700">
                      <GitBranch className="w-4 h-4 mr-2" />
                      View Timeline
                    </Button>
                  </Link>
                  <Link href={`/admin/projects/${id}/files`}>
                    <Button variant="outline" className="w-full font-mono bg-gray-800 border-gray-700 text-white hover:bg-gray-700">
                      <Settings className="w-4 h-4 mr-2" />
                      Manage Files
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}