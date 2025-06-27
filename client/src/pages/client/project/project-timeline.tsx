import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, CheckCircle, Clock, AlertCircle } from "lucide-react";
import ProjectLayout from "./project-layout";
import type { Project, ProjectUpdate } from "@shared/schema";

export default function ProjectTimeline() {
  const { id } = useParams();

  const { data: project, isLoading: projectLoading } = useQuery<Project>({
    queryKey: [`/api/projects/${id}`],
    enabled: !!id,
  });

  const { data: updates, isLoading: updatesLoading } = useQuery<ProjectUpdate[]>({
    queryKey: [`/api/projects/${id}/updates`],
    enabled: !!id,
  });

  if (projectLoading || updatesLoading) {
    return (
      <ProjectLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-400 font-mono">Loading timeline...</div>
        </div>
      </ProjectLayout>
    );
  }

  const getStatusColor = (status: string | undefined) => {
    switch (status) {
      case "completed": return "bg-green-600";
      case "active": return "bg-blue-600";
      case "cancelled": return "bg-red-600";
      default: return "bg-gray-600";
    }
  };

  const timelineEvents = [
    {
      id: 1,
      title: "Project Created",
      description: `Project "${project?.title}" was initiated`,
      date: project?.createdAt ? new Date(project.createdAt) : new Date(),
      type: "milestone",
      status: "completed"
    },
    ...(project?.startDate ? [{
      id: 2,
      title: "Project Started",
      description: "Development work began",
      date: new Date(project.startDate),
      type: "milestone", 
      status: "completed"
    }] : []),
    ...(updates || []).map(update => ({
      id: update.id + 100,
      title: update.title,
      description: update.description || "Project update",
      date: update.createdAt ? new Date(update.createdAt) : new Date(),
      type: "update",
      status: update.isCompleted ? "completed" : "pending"
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

  return (
    <ProjectLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white font-mono">Project Timeline</h1>
            <p className="text-gray-400 font-mono mt-2">Track project milestones and progress</p>
          </div>
          <Badge className={`${getStatusColor(project?.status)} text-white font-mono`}>
            {project?.status || "Unknown"}
          </Badge>
        </div>

        {/* Project Summary */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white font-mono flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Project Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="text-gray-400 font-mono text-sm mb-1">Start Date</div>
                <div className="text-white font-mono">
                  {project?.startDate ? new Date(project.startDate).toLocaleDateString() : "TBD"}
                </div>
              </div>
              <div>
                <div className="text-gray-400 font-mono text-sm mb-1">End Date</div>
                <div className="text-white font-mono">
                  {project?.endDate ? new Date(project.endDate).toLocaleDateString() : "TBD"}
                </div>
              </div>
              <div>
                <div className="text-gray-400 font-mono text-sm mb-1">Duration</div>
                <div className="text-white font-mono">
                  {project?.startDate && project?.endDate 
                    ? `${Math.ceil((new Date(project.endDate).getTime() - new Date(project.startDate).getTime()) / (1000 * 60 * 60 * 24))} days`
                    : "TBD"}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Timeline */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white font-mono">Timeline Events</CardTitle>
            <CardDescription className="text-gray-400 font-mono">
              Chronological view of project milestones and updates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {timelineEvents.map((event, index) => (
                <div key={event.id} className="flex items-start space-x-4">
                  {/* Timeline marker */}
                  <div className="flex flex-col items-center">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                      event.status === "completed" ? "bg-green-600" : 
                      event.status === "pending" ? "bg-yellow-600" : "bg-gray-600"
                    }`}>
                      {event.status === "completed" ? (
                        <CheckCircle className="w-2 h-2 text-white" />
                      ) : event.status === "pending" ? (
                        <Clock className="w-2 h-2 text-white" />
                      ) : (
                        <AlertCircle className="w-2 h-2 text-white" />
                      )}
                    </div>
                    {index < timelineEvents.length - 1 && (
                      <div className="w-0.5 h-8 bg-gray-700 mt-2"></div>
                    )}
                  </div>

                  {/* Event content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-white font-mono font-semibold">{event.title}</h3>
                      <span className="text-gray-400 font-mono text-sm">
                        {event.date.toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-400 font-mono text-sm mt-1">{event.description}</p>
                    <Badge 
                      variant="secondary" 
                      className={`mt-2 text-xs font-mono ${
                        event.type === "milestone" ? "bg-blue-900 text-blue-300" : "bg-purple-900 text-purple-300"
                      }`}
                    >
                      {event.type}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>

            {timelineEvents.length === 0 && (
              <div className="text-center py-12">
                <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 font-mono">No timeline events yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ProjectLayout>
  );
}