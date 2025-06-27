import { useState } from "react";
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
  Timeline
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import AdminLayout from "../admin-layout";
import type { Project, User as UserType } from "@shared/schema";

export default function AdminProjectDetail() {
  const { id } = useParams();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);

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
      toast({
        title: "Success",
        description: "Project updated successfully",
      });
      setIsEditing(false);
    },
    onError: () => {
      toast({
        title: "Error", 
        description: "Failed to update project",
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    updateProject.mutate(editForm);
  };

  const handleCancel = () => {
    setEditForm({
      title: project?.title || "",
      description: project?.description || "",
      status: project?.status || "inquiry",
      budget: project?.budget || "",
      startDate: project?.startDate ? new Date(project.startDate).toISOString().split('T')[0] : "",
      endDate: project?.endDate ? new Date(project.endDate).toISOString().split('T')[0] : "",
    });
    setIsEditing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-600";
      case "active": return "bg-blue-600";
      case "cancelled": return "bg-red-600";
      case "proposal": return "bg-yellow-600";
      default: return "bg-gray-600";
    }
  };

  if (projectLoading || clientLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-400 font-mono">Loading project details...</div>
        </div>
      </AdminLayout>
    );
  }

  if (!project) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-400 font-mono">Project not found</div>
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
            <h1 className="text-3xl font-bold text-white font-mono">Project Management</h1>
            <p className="text-gray-400 font-mono mt-2">Manage project details and settings</p>
          </div>
          <div className="flex items-center gap-4">
            <Badge className={`${getStatusColor(project.status)} text-white font-mono`}>
              {project.status}
            </Badge>
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)} className="bg-blue-600 hover:bg-blue-700 text-white font-mono">
                <Edit className="w-4 h-4 mr-2" />
                Edit Project
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button onClick={handleSave} disabled={updateProject.isPending} className="bg-green-600 hover:bg-green-700 text-white font-mono">
                  <Save className="w-4 h-4 mr-2" />
                  {updateProject.isPending ? "Saving..." : "Save"}
                </Button>
                <Button onClick={handleCancel} variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800 font-mono">
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Project Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white font-mono">Project Information</CardTitle>
                <CardDescription className="text-gray-400 font-mono">
                  Core project details and timeline
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <>
                    <div>
                      <Label htmlFor="title" className="text-white font-mono">Project Title</Label>
                      <Input
                        id="title"
                        value={editForm.title}
                        onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                        className="bg-gray-800 border-gray-700 text-white font-mono mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="description" className="text-white font-mono">Description</Label>
                      <Textarea
                        id="description"
                        value={editForm.description}
                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                        className="bg-gray-800 border-gray-700 text-white font-mono mt-1"
                        rows={3}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="status" className="text-white font-mono">Status</Label>
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
                        <Label htmlFor="budget" className="text-white font-mono">Budget</Label>
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
                        <Label htmlFor="startDate" className="text-white font-mono">Start Date</Label>
                        <Input
                          id="startDate"
                          type="date"
                          value={editForm.startDate}
                          onChange={(e) => setEditForm({ ...editForm, startDate: e.target.value })}
                          className="bg-gray-800 border-gray-700 text-white font-mono mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="endDate" className="text-white font-mono">End Date</Label>
                        <Input
                          id="endDate"
                          type="date"
                          value={editForm.endDate}
                          onChange={(e) => setEditForm({ ...editForm, endDate: e.target.value })}
                          className="bg-gray-800 border-gray-700 text-white font-mono mt-1"
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <h3 className="text-lg font-semibold text-white font-mono">{project.title}</h3>
                      <p className="text-gray-400 font-mono mt-1">{project.description || "No description provided"}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400 font-mono">Budget:</span>
                        <p className="text-white font-mono">{project.budget || "Not specified"}</p>
                      </div>
                      <div>
                        <span className="text-gray-400 font-mono">Status:</span>
                        <p className="text-white font-mono capitalize">{project.status}</p>
                      </div>
                      <div>
                        <span className="text-gray-400 font-mono">Start Date:</span>
                        <p className="text-white font-mono">
                          {project.startDate ? new Date(project.startDate).toLocaleDateString() : "Not set"}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-400 font-mono">End Date:</span>
                        <p className="text-white font-mono">
                          {project.endDate ? new Date(project.endDate).toLocaleDateString() : "Not set"}
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Recent Messages */}
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white font-mono flex items-center">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Recent Messages
                </CardTitle>
                <CardDescription className="text-gray-400 font-mono">
                  Latest communication with client
                </CardDescription>
              </CardHeader>
              <CardContent>
                {messagesLoading ? (
                  <div className="text-gray-400 font-mono">Loading messages...</div>
                ) : messages && messages.length > 0 ? (
                  <div className="space-y-3">
                    {messages.slice(0, 5).map((message: any) => (
                      <div key={message.id} className="p-3 bg-gray-800 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-400 font-mono">
                            {message.senderId === client?.id ? client?.firstName || client?.email : 'Admin'}
                          </span>
                          <span className="text-xs text-gray-500 font-mono">
                            {new Date(message.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-white font-mono text-sm">{message.message}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-400 font-mono">No messages yet</div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Client Information */}
          <div className="space-y-6">
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white font-mono flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Client Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {client ? (
                  <>
                    <div>
                      <span className="text-gray-400 font-mono text-sm">Name:</span>
                      <p className="text-white font-mono">{client.firstName} {client.lastName}</p>
                    </div>
                    <div>
                      <span className="text-gray-400 font-mono text-sm">Email:</span>
                      <p className="text-white font-mono">{client.email}</p>
                    </div>
                    <div>
                      <span className="text-gray-400 font-mono text-sm">Member Since:</span>
                      <p className="text-white font-mono">
                        {client.createdAt ? new Date(client.createdAt).toLocaleDateString() : 'Unknown'}
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="text-gray-400 font-mono">Loading client information...</div>
                )}
              </CardContent>
            </Card>

            {/* Project Stats */}
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white font-mono">Project Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 font-mono text-sm">Messages</span>
                  <span className="text-white font-mono">{messages?.length || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 font-mono text-sm">Created</span>
                  <span className="text-white font-mono">
                    {project.createdAt ? new Date(project.createdAt).toLocaleDateString() : 'Unknown'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 font-mono text-sm">Last Updated</span>
                  <span className="text-white font-mono">
                    {project.updatedAt ? new Date(project.updatedAt).toLocaleDateString() : 'Unknown'}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}