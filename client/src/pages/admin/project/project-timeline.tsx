import { useState } from "react";
import { useParams } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Calendar, CheckCircle, Clock, AlertCircle, Plus, Edit, Trash2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import AdminLayout from "../admin-layout";
import type { Project, ProjectUpdate } from "@shared/schema";

export default function AdminProjectTimeline() {
  const { id } = useParams();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddingUpdate, setIsAddingUpdate] = useState(false);
  const [newUpdate, setNewUpdate] = useState({
    title: "",
    description: "",
    isCompleted: false,
  });

  const { data: project, isLoading: projectLoading } = useQuery<Project>({
    queryKey: [`/api/projects/${id}`],
    enabled: !!id,
  });

  const { data: updates, isLoading: updatesLoading } = useQuery<ProjectUpdate[]>({
    queryKey: [`/api/projects/${id}/updates`],
    enabled: !!id,
  });

  const addUpdate = useMutation({
    mutationFn: async (updateData: typeof newUpdate) => {
      return apiRequest("POST", `/api/projects/${id}/updates`, updateData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/projects/${id}/updates`] });
      setNewUpdate({ title: "", description: "", isCompleted: false });
      setIsAddingUpdate(false);
      toast({
        title: "Update added",
        description: "Project update has been added successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add project update",
        variant: "destructive",
      });
    },
  });

  const toggleUpdateStatus = useMutation({
    mutationFn: async ({ updateId, isCompleted }: { updateId: number; isCompleted: boolean }) => {
      return apiRequest("PATCH", `/api/project-updates/${updateId}`, { isCompleted });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/projects/${id}/updates`] });
      toast({
        title: "Status updated",
        description: "Update status has been changed",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
    },
  });

  const deleteUpdate = useMutation({
    mutationFn: async (updateId: number) => {
      return apiRequest("DELETE", `/api/project-updates/${updateId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/projects/${id}/updates`] });
      toast({
        title: "Update deleted",
        description: "Project update has been removed",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete update",
        variant: "destructive",
      });
    },
  });

  const getStatusColor = (status: string | undefined) => {
    switch (status) {
      case "completed": return "bg-green-600";
      case "active": return "bg-blue-600";
      case "cancelled": return "bg-red-600";
      case "proposal": return "bg-yellow-600";
      default: return "bg-gray-600";
    }
  };

  const handleAddUpdate = () => {
    if (!newUpdate.title.trim()) {
      toast({
        title: "Error",
        description: "Update title is required",
        variant: "destructive",
      });
      return;
    }
    addUpdate.mutate(newUpdate);
  };

  // Define timeline item types
  type TimelineItem = {
    id: number;
    title: string;
    description: string;
    date: Date;
    type: string;
    status: string;
    updateId?: number;
    isCompleted?: boolean;
  };

  // Combine project milestones with updates for timeline
  const timelineItems: TimelineItem[] = [
    {
      id: 1,
      title: "Project Started",
      description: "Project officially began",
      date: project?.startDate ? new Date(project.startDate) : new Date(project?.createdAt || Date.now()),
      type: "milestone",
      status: "completed"
    },
    ...(updates || []).map(update => ({
      id: update.id + 100,
      title: update.title,
      description: update.description || "Project update",
      date: update.createdAt ? new Date(update.createdAt) : new Date(),
      type: "update",
      status: update.isCompleted ? "completed" : "pending",
      updateId: update.id,
      isCompleted: update.isCompleted
    })),
    ...(project?.endDate ? [{
      id: 999,
      title: "Project Completion",
      description: "Project delivery and completion",
      date: new Date(project.endDate),
      type: "milestone", 
      status: project.status === "completed" ? "completed" : "pending"
    }] : [])
  ].sort((a, b) => a.date.getTime() - b.date.getTime());

  if (projectLoading || updatesLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-400 font-mono">Loading timeline...</div>
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
            <h1 className="text-3xl font-bold text-white font-mono">Project Timeline</h1>
            <p className="text-gray-400 font-mono mt-2">Manage project milestones and updates</p>
          </div>
          <div className="flex items-center gap-4">
            <Badge className={`${getStatusColor(project?.status)} text-white font-mono`}>
              {project?.status || "Unknown"}
            </Badge>
            <Dialog open={isAddingUpdate} onOpenChange={setIsAddingUpdate}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white font-mono">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Update
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-900 border-gray-700">
                <DialogHeader>
                  <DialogTitle className="text-white font-mono">Add Project Update</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title" className="text-white font-mono">Title</Label>
                    <Input
                      id="title"
                      value={newUpdate.title}
                      onChange={(e) => setNewUpdate({ ...newUpdate, title: e.target.value })}
                      className="bg-gray-800 border-gray-700 text-white font-mono mt-1"
                      placeholder="Update title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description" className="text-white font-mono">Description</Label>
                    <Textarea
                      id="description"
                      value={newUpdate.description}
                      onChange={(e) => setNewUpdate({ ...newUpdate, description: e.target.value })}
                      className="bg-gray-800 border-gray-700 text-white font-mono mt-1"
                      placeholder="Update description"
                      rows={3}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="completed"
                      checked={newUpdate.isCompleted}
                      onChange={(e) => setNewUpdate({ ...newUpdate, isCompleted: e.target.checked })}
                      className="rounded"
                    />
                    <Label htmlFor="completed" className="text-white font-mono">Mark as completed</Label>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button
                      onClick={() => setIsAddingUpdate(false)}
                      variant="outline"
                      className="border-gray-600 text-gray-300 hover:bg-gray-800 font-mono"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleAddUpdate}
                      disabled={addUpdate.isPending}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-mono"
                    >
                      {addUpdate.isPending ? "Adding..." : "Add Update"}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Project Summary */}
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white font-mono">{project?.title}</CardTitle>
            <CardDescription className="text-gray-400 font-mono">
              {project?.description || "No description provided"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <span className="text-gray-400 font-mono text-sm">Start Date:</span>
                <p className="text-white font-mono">
                  {project?.startDate ? new Date(project.startDate).toLocaleDateString() : "Not set"}
                </p>
              </div>
              <div>
                <span className="text-gray-400 font-mono text-sm">End Date:</span>
                <p className="text-white font-mono">
                  {project?.endDate ? new Date(project.endDate).toLocaleDateString() : "Not set"}
                </p>
              </div>
              <div>
                <span className="text-gray-400 font-mono text-sm">Budget:</span>
                <p className="text-white font-mono">{project?.budget || "Not specified"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Timeline */}
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white font-mono flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Project Timeline
            </CardTitle>
            <CardDescription className="text-gray-400 font-mono">
              Milestones and updates chronologically ordered
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {timelineItems.length > 0 ? (
                timelineItems.map((item, index) => (
                  <div key={item.id} className="relative">
                    {/* Timeline line */}
                    {index !== timelineItems.length - 1 && (
                      <div className="absolute left-6 top-12 w-0.5 h-16 bg-gray-700"></div>
                    )}
                    
                    <div className="flex items-start space-x-4">
                      {/* Timeline icon */}
                      <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                        item.status === "completed" ? "bg-green-600" : 
                        item.status === "pending" ? "bg-yellow-600" : "bg-gray-600"
                      }`}>
                        {item.status === "completed" ? (
                          <CheckCircle className="w-6 h-6 text-white" />
                        ) : item.type === "milestone" ? (
                          <Calendar className="w-6 h-6 text-white" />
                        ) : (
                          <Clock className="w-6 h-6 text-white" />
                        )}
                      </div>
                      
                      {/* Timeline content */}
                      <div className="flex-1 bg-gray-800 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <h3 className="text-lg font-semibold text-white font-mono">{item.title}</h3>
                            <Badge variant="outline" className="border-gray-600 text-gray-300 font-mono">
                              {item.type}
                            </Badge>
                            <Badge className={`${
                              item.status === "completed" ? "bg-green-600" :
                              item.status === "pending" ? "bg-yellow-600" : "bg-gray-600"
                            } text-white font-mono`}>
                              {item.status}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-gray-400 font-mono text-sm">
                              {item.date.toLocaleDateString()}
                            </span>
                            {item.type === "update" && typeof item.updateId === 'number' && (
                              <div className="flex space-x-1">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => toggleUpdateStatus.mutate({ 
                                    updateId: item.updateId, 
                                    isCompleted: !(item.isCompleted || false) 
                                  })}
                                  className="border-gray-600 text-gray-300 hover:bg-gray-700 font-mono p-1"
                                >
                                  {item.isCompleted ? <Clock className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => deleteUpdate.mutate(item.updateId)}
                                  className="border-red-600 text-red-400 hover:bg-red-900 font-mono p-1"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                        <p className="text-gray-300 font-mono">{item.description}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-400 font-mono mb-2">No timeline items yet</h3>
                  <p className="text-gray-500 font-mono">Add project updates to build the timeline</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}