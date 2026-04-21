import { useParams } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Settings, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  DollarSign,
  Shield,
  Bell,
  Eye,
  Archive
} from "lucide-react";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import ProjectLayout from "./project-layout";
import type { Project } from "@shared/schema";

const projectSettingsSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  status: z.enum(["inquiry", "proposal", "active", "completed", "cancelled"]),
  budget: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

type ProjectSettingsForm = z.infer<typeof projectSettingsSchema>;

export default function ProjectSettings() {
  const { id } = useParams();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: project, isLoading } = useQuery<Project>({
    queryKey: [`/api/projects/${id}`],
    enabled: !!id,
  });

  const form = useForm<ProjectSettingsForm>({
    resolver: zodResolver(projectSettingsSchema),
    defaultValues: {
      title: project?.title || "",
      description: project?.description || "",
      status: (project?.status as "inquiry" | "proposal" | "active" | "completed" | "cancelled") || "active",
      budget: project?.budget || "",
      startDate: project?.startDate ? new Date(project.startDate).toISOString().split('T')[0] : "",
      endDate: project?.endDate ? new Date(project.endDate).toISOString().split('T')[0] : "",
    },
  });

  const updateProject = useMutation({
    mutationFn: async (data: ProjectSettingsForm) => {
      return apiRequest("PATCH", `/api/projects/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/projects/${id}`] });
      toast({
        title: "Settings Updated",
        description: "Project settings have been saved successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Failed to update project settings",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ProjectSettingsForm) => {
    updateProject.mutate(data);
  };

  if (isLoading) {
    return (
      <ProjectLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-white/60">Loading settings...</div>
        </div>
      </ProjectLayout>
    );
  }

  return (
    <ProjectLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Project Settings</h1>
            <p className="text-white/60 mt-2">Manage project configuration and preferences</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Settings */}
          <div className="lg:col-span-2 space-y-6">
            {/* Project Information */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  Project Information
                </CardTitle>
                <CardDescription className="text-white/60">
                  Basic project details and metadata
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title" className="text-white">Project Title</Label>
                      <Input
                        id="title"
                        {...form.register("title")}
                        className="bg-gray-800 border-gray-700 text-white mt-1"
                        placeholder="Enter project title"
                      />
                      {form.formState.errors.title && (
                        <p className="text-red-400 text-sm mt-1">{form.formState.errors.title.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="status" className="text-white">Status</Label>
                      <Select value={form.watch("status")} onValueChange={(value) => form.setValue("status", value as any)}>
                        <SelectTrigger className="bg-gray-800 border-gray-700 text-white mt-1">
                          <SelectValue placeholder="Select status" />
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
                  </div>

                  <div>
                    <Label htmlFor="description" className="text-white">Description</Label>
                    <Textarea
                      id="description"
                      {...form.register("description")}
                      className="bg-gray-800 border-gray-700 text-white mt-1"
                      placeholder="Project description"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="budget" className="text-white">Budget</Label>
                      <Input
                        id="budget"
                        {...form.register("budget")}
                        className="bg-gray-800 border-gray-700 text-white mt-1"
                        placeholder="$0.00"
                      />
                    </div>

                    <div>
                      <Label htmlFor="startDate" className="text-white">Start Date</Label>
                      <Input
                        id="startDate"
                        type="date"
                        {...form.register("startDate")}
                        className="bg-gray-800 border-gray-700 text-white mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="endDate" className="text-white">End Date</Label>
                      <Input
                        id="endDate"
                        type="date"
                        {...form.register("endDate")}
                        className="bg-gray-800 border-gray-700 text-white mt-1"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button 
                      type="submit" 
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      disabled={updateProject.isPending}
                    >
                      {updateProject.isPending ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Bell className="w-5 h-5 mr-2" />
                  Notification Preferences
                </CardTitle>
                <CardDescription className="text-white/60">
                  Configure how you receive project updates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-semibold">Email Notifications</h4>
                      <p className="text-white/60 text-sm">Receive updates via email</p>
                    </div>
                    <Button variant="outline" size="sm" className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700">
                      Enabled
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-semibold">Project Updates</h4>
                      <p className="text-white/60 text-sm">Notify when milestones are completed</p>
                    </div>
                    <Button variant="outline" size="sm" className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700">
                      Enabled
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-semibold">Message Notifications</h4>
                      <p className="text-white/60 text-sm">Alert when new messages arrive</p>
                    </div>
                    <Button variant="outline" size="sm" className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700">
                      Enabled
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-semibold">File Uploads</h4>
                      <p className="text-white/60 text-sm">Notify when files are shared</p>
                    </div>
                    <Button variant="outline" size="sm" className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700">
                      Enabled
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Project Status */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Project Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white/60 text-sm">Status</span>
                    <Badge className="bg-blue-900 text-blue-300">
                      {project?.status || "Active"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/60 text-sm">Created</span>
                    <span className="text-white text-sm">
                      {project?.createdAt ? new Date(project.createdAt).toLocaleDateString() : "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/60 text-sm">Last Updated</span>
                    <span className="text-white text-sm">
                      {project?.updatedAt ? new Date(project.updatedAt).toLocaleDateString() : "N/A"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Project Contacts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-white font-semibold mb-2">Project Manager</h4>
                    <div className="space-y-2">
                      <div className="flex items-center text-white/60 text-sm">
                        <User className="w-4 h-4 mr-2" />
                        Kyle Landon
                      </div>
                      <div className="flex items-center text-white/60 text-sm">
                        <Mail className="w-4 h-4 mr-2" />
                        kyle@landonco.co
                      </div>
                      <div className="flex items-center text-white/60 text-sm">
                        <Phone className="w-4 h-4 mr-2" />
                        (940) 389-2685
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full bg-gray-800 border-gray-700 text-white hover:bg-gray-700">
                    <Eye className="w-4 h-4 mr-2" />
                    View Public Page
                  </Button>
                  <Button variant="outline" className="w-full bg-gray-800 border-gray-700 text-white hover:bg-gray-700">
                    <Archive className="w-4 h-4 mr-2" />
                    Export Project Data
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProjectLayout>
  );
}