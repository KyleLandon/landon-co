import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Settings, User, Bell, Shield, Archive } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import ProjectLayout from "./project-layout";

export default function ProjectSettings() {
  const { id } = useParams();

  const { data: project, isLoading } = useQuery({
    queryKey: [`/api/projects/${id}`],
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <ProjectLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-white font-mono">Loading settings...</div>
        </div>
      </ProjectLayout>
    );
  }

  return (
    <ProjectLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white font-mono mb-2">Project Settings</h1>
          <p className="text-white font-mono">Manage your project preferences and notifications</p>
        </div>

        {/* Project Information */}
        <Card className="bg-black border-white">
          <CardHeader>
            <CardTitle className="text-white font-mono flex items-center">
              <User className="w-5 h-5 mr-2" />
              Project Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-white font-mono">Project Name</Label>
              <div className="mt-1 p-3 bg-black border border-white rounded-md">
                <span className="text-white font-mono">{(project as any)?.title || "Project Name"}</span>
              </div>
            </div>
            <div>
              <Label className="text-white font-mono">Description</Label>
              <div className="mt-1 p-3 bg-black border border-white rounded-md">
                <span className="text-white font-mono">{(project as any)?.description || "Project description"}</span>
              </div>
            </div>
            <div>
              <Label className="text-white font-mono">Status</Label>
              <div className="mt-1 p-3 bg-black border border-white rounded-md">
                <span className="text-white font-mono capitalize">{(project as any)?.status || "Active"}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="bg-black border-white">
          <CardHeader>
            <CardTitle className="text-white font-mono flex items-center">
              <Bell className="w-5 h-5 mr-2" />
              Notification Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-white font-mono">Email Notifications</Label>
                <p className="text-white font-mono text-sm mt-1">Receive updates via email</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-white font-mono">Project Updates</Label>
                <p className="text-white font-mono text-sm mt-1">Get notified of project milestones</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-white font-mono">New Messages</Label>
                <p className="text-white font-mono text-sm mt-1">Instant notifications for new messages</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-white font-mono">Weekly Summary</Label>
                <p className="text-white font-mono text-sm mt-1">Weekly progress reports</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        {/* Privacy & Security */}
        <Card className="bg-black border-white">
          <CardHeader>
            <CardTitle className="text-white font-mono flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              Privacy & Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-white font-mono">Two-Factor Authentication</Label>
                <p className="text-white font-mono text-sm mt-1">Add extra security to your account</p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                className="bg-black border-white text-white hover:bg-white hover:text-black font-mono"
              >
                Enable
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-white font-mono">Download Project Data</Label>
                <p className="text-white font-mono text-sm mt-1">Export all your project information</p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                className="bg-black border-white text-white hover:bg-white hover:text-black font-mono"
              >
                Download
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Advanced Settings */}
        <Card className="bg-black border-white">
          <CardHeader>
            <CardTitle className="text-white font-mono flex items-center">
              <Archive className="w-5 h-5 mr-2" />
              Advanced
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-white font-mono">Archive Project</Label>
                <p className="text-white font-mono text-sm mt-1">Move project to archived status</p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                className="bg-black border-white text-white hover:bg-white hover:text-black font-mono"
              >
                Archive
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-white font-mono">Request Changes</Label>
                <p className="text-white font-mono text-sm mt-1">Submit modification requests</p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                className="bg-black border-white text-white hover:bg-white hover:text-black font-mono"
              >
                Request
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Save Changes */}
        <div className="flex justify-end space-x-4">
          <Button 
            variant="outline"
            className="bg-black border-white text-white hover:bg-white hover:text-black font-mono"
          >
            Cancel
          </Button>
          <Button className="bg-white text-black hover:bg-gray-200 font-mono">
            Save Changes
          </Button>
        </div>
      </div>
    </ProjectLayout>
  );
}