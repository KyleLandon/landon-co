import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAppUser as useAuth } from "@/hooks/use-app-user";
import FileManager from "@/components/file-manager";
import ProjectLayout from "./project-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FolderOpen, Clock } from "lucide-react";
import type { Project } from "@shared/schema";

export default function ProjectFiles() {
  const { id } = useParams();
  const { user } = useAuth();

  const { data: project, isLoading } = useQuery<Project>({
    queryKey: [`/api/projects/${id}`],
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <ProjectLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-white/60">Loading project...</div>
        </div>
      </ProjectLayout>
    );
  }

  if (!project) {
    return (
      <ProjectLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-white/60">Project not found</div>
        </div>
      </ProjectLayout>
    );
  }

  return (
    <ProjectLayout>
      <div className="space-y-6">
        {/* Project Header */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <FolderOpen className="w-6 h-6 mr-3" />
              Project Files
            </CardTitle>
            <div className="flex items-center space-x-4 mt-2">
              <Badge 
                variant={project.status === 'active' ? 'default' : 'secondary'}
               
              >
                {project.status?.toUpperCase()}
              </Badge>
              <div className="flex items-center text-white/60 text-sm">
                <Clock className="w-4 h-4 mr-2" />
                Created {project.createdAt ? new Date(project.createdAt).toLocaleDateString() : 'Unknown'}
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* File Manager */}
        <FileManager 
          projectId={id || ""} 
          isAdmin={false} 
        />
        
        {/* Info Box */}
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-4">
            <div className="text-sm text-white/60 space-y-2">
              <p>• Upload project assets, references, and feedback files</p>
              <p>• Download deliverables and project resources</p>
              <p>• Some files may be private and only visible to the admin</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </ProjectLayout>
  );
}