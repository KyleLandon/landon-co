import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAppUser as useAuth } from "@/hooks/use-app-user";
import FileManager from "@/components/file-manager";
import AdminLayout from "../admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, FolderOpen } from "lucide-react";
import type { Project, User as UserType } from "@shared/schema";

export default function AdminProjectFiles() {
  const { id } = useParams();
  const { user } = useAuth();

  const { data: project, isLoading: projectLoading } = useQuery<Project>({
    queryKey: [`/api/projects/${id}`],
    enabled: !!id,
  });

  const { data: client } = useQuery<UserType>({
    queryKey: [`/api/users/${project?.clientId}`],
    enabled: !!project?.clientId,
  });

  if (projectLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-white/60">Loading project...</div>
        </div>
      </AdminLayout>
    );
  }

  if (!project) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-white/60">Project not found</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Project Header */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white flex items-center">
                  <FolderOpen className="w-6 h-6 mr-3" />
                  {project.title} - Files
                </CardTitle>
                <div className="flex items-center space-x-4 mt-2">
                  <Badge 
                    variant={project.status === 'active' ? 'default' : 'secondary'}
                   
                  >
                    {project.status?.toUpperCase()}
                  </Badge>
                  {client && (
                    <div className="flex items-center text-white/60">
                      <User className="w-4 h-4 mr-2" />
                      {client.firstName} {client.lastName}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* File Manager */}
        <FileManager 
          projectId={id || ""} 
          isAdmin={user?.role === "admin"} 
        />
      </div>
    </AdminLayout>
  );
}