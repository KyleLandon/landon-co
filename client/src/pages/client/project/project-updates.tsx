import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, Plus, FileText } from "lucide-react";
import ProjectLayout from "./project-layout";
import type { ProjectUpdate } from "@shared/schema";

export default function ProjectUpdates() {
  const { id } = useParams();

  const { data: updates, isLoading } = useQuery<ProjectUpdate[]>({
    queryKey: [`/api/projects/${id}/updates`],
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <ProjectLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-white/60">Loading updates...</div>
        </div>
      </ProjectLayout>
    );
  }

  const completedUpdates = updates?.filter(update => update.isCompleted) || [];
  const pendingUpdates = updates?.filter(update => !update.isCompleted) || [];

  return (
    <ProjectLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Project Updates</h1>
            <p className="text-white/60 mt-2">Track development progress and milestones</p>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="secondary" className="bg-gray-800 text-gray-300">
              {completedUpdates.length}/{updates?.length || 0} Completed
            </Badge>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="w-8 h-8 text-green-400 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-white">{completedUpdates.length}</p>
                  <p className="text-white/60 text-sm">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="w-8 h-8 text-yellow-400 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-white">{pendingUpdates.length}</p>
                  <p className="text-white/60 text-sm">In Progress</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center">
                <FileText className="w-8 h-8 text-blue-400 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-white">{updates?.length || 0}</p>
                  <p className="text-white/60 text-sm">Total Updates</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Updates */}
        {pendingUpdates.length > 0 && (
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Clock className="w-5 h-5 mr-2 text-yellow-400" />
                In Progress
              </CardTitle>
              <CardDescription className="text-white/60">
                Updates currently being worked on
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingUpdates.map((update) => (
                  <div key={update.id} className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-white font-semibold mb-2">{update.title}</h3>
                        {update.description && (
                          <p className="text-white/60 text-sm mb-3">{update.description}</p>
                        )}
                        <div className="flex items-center space-x-4">
                          <Badge variant="secondary" className="bg-yellow-900 text-yellow-300">
                            In Progress
                          </Badge>
                          <span className="text-white/50 text-xs">
                            Created {update.createdAt ? new Date(update.createdAt).toLocaleDateString() : 'Unknown'}
                          </span>
                        </div>
                      </div>
                      <Clock className="w-5 h-5 text-yellow-400 ml-4" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Completed Updates */}
        {completedUpdates.length > 0 && (
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-400" />
                Completed
              </CardTitle>
              <CardDescription className="text-white/60">
                Finished milestones and deliverables
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {completedUpdates.map((update) => (
                  <div key={update.id} className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-white font-semibold mb-2">{update.title}</h3>
                        {update.description && (
                          <p className="text-white/60 text-sm mb-3">{update.description}</p>
                        )}
                        <div className="flex items-center space-x-4">
                          <Badge variant="secondary" className="bg-green-900 text-green-300">
                            Completed
                          </Badge>
                          <span className="text-white/50 text-xs">
                            Completed {update.createdAt ? new Date(update.createdAt).toLocaleDateString() : 'Unknown'}
                          </span>
                        </div>
                      </div>
                      <CheckCircle className="w-5 h-5 text-green-400 ml-4" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {(!updates || updates.length === 0) && (
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-12 text-center">
              <FileText className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-white font-semibold mb-2">No Updates Yet</h3>
              <p className="text-white/60 mb-6">
                Project updates will appear here as development progresses
              </p>
              <p className="text-white/50 text-sm">
                Updates are managed by the Landon & Co. team and will be posted regularly
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </ProjectLayout>
  );
}