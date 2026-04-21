import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { 
  Calendar, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  TrendingUp,
  MessageCircle,
  FileText
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import ProjectLayout from "./project-layout";
import type { Project, Message, ProjectUpdate } from "@shared/schema";

export default function ProjectOverview() {
  const { id } = useParams();

  const { data: project, isLoading } = useQuery<Project>({
    queryKey: [`/api/projects/${id}`],
    enabled: !!id,
  });

  const { data: messages } = useQuery<Message[]>({
    queryKey: [`/api/projects/${id}/messages`],
    enabled: !!id,
  });

  const { data: updates } = useQuery<ProjectUpdate[]>({
    queryKey: [`/api/projects/${id}/updates`],
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-600';
      case 'in_progress': return 'bg-blue-600';
      case 'proposal': return 'bg-yellow-600';
      case 'on_hold': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Completed';
      case 'in_progress': return 'In Progress';
      case 'proposal': return 'Proposal';
      case 'on_hold': return 'On Hold';
      default: return status;
    }
  };

  // Calculate project progress (example calculation)
  const completedUpdates = Array.isArray(updates) ? updates.filter((update: any) => update.isCompleted).length : 0;
  const totalUpdates = Array.isArray(updates) ? updates.length : 0;
  const progress = totalUpdates > 0 ? (completedUpdates / totalUpdates) * 100 : 0;

  const stats = [
    {
      title: "Total Budget",
      value: project?.budget ? `$${parseInt(project.budget).toLocaleString()}` : "TBD",
      icon: DollarSign,
      color: "text-green-400"
    },
    {
      title: "Messages",
      value: Array.isArray(messages) ? messages.length : 0,
      icon: MessageCircle,
      color: "text-blue-400"
    },
    {
      title: "Updates",
      value: `${completedUpdates}/${totalUpdates}`,
      icon: CheckCircle,
      color: "text-yellow-400"
    },
    {
      title: "Progress",
      value: `${Math.round(progress)}%`,
      icon: TrendingUp,
      color: "text-purple-400"
    }
  ];

  return (
    <ProjectLayout>
      <div className="space-y-6">
        {/* Project Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {project?.title || "Loading..."}
            </h1>
            <p className="text-white/60 mb-4">
              {project?.description || "Loading project description..."}
            </p>
            <div className="flex items-center space-x-4">
              <Badge className={`${getStatusColor(project?.status)} text-white`}>
                {getStatusText(project?.status)}
              </Badge>
              {project?.startDate && (
                <div className="flex items-center text-white/60 text-sm">
                  <Calendar className="w-4 h-4 mr-1" />
                  Started {new Date(project.startDate).toLocaleDateString()}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/60 text-sm">{stat.title}</p>
                      <p className="text-2xl font-bold text-white">{stat.value}</p>
                    </div>
                    <stat.icon className={`w-8 h-8 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Project Progress */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Project Progress</CardTitle>
            <CardDescription className="text-white/60">
              Overall completion status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Completion</span>
                <span className="text-white">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Messages */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <MessageCircle className="w-5 h-5 mr-2" />
                Recent Messages
              </CardTitle>
            </CardHeader>
            <CardContent>
              {messages && messages.length > 0 ? (
                <div className="space-y-3">
                  {messages.slice(-3).map((message: any) => (
                    <div key={message.id} className="p-3 bg-gray-800 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-white/60">
                          {message.senderId === project?.clientId ? "You" : "Admin"}
                        </span>
                        <span className="text-xs text-white/50">
                          {new Date(message.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-white text-sm line-clamp-2">
                        {message.message}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-white/60 text-center py-4">
                  No messages yet
                </p>
              )}
            </CardContent>
          </Card>

          {/* Recent Updates */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                Recent Updates
              </CardTitle>
            </CardHeader>
            <CardContent>
              {updates && updates.length > 0 ? (
                <div className="space-y-3">
                  {updates.slice(-3).map((update: any) => (
                    <div key={update.id} className="p-3 bg-gray-800 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-white font-bold">
                          {update.title}
                        </span>
                        {update.isCompleted ? (
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        ) : (
                          <Clock className="w-4 h-4 text-yellow-400" />
                        )}
                      </div>
                      <p className="text-white/60 text-sm line-clamp-2">
                        {update.description}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-white/60 text-center py-4">
                  No updates yet
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Timeline Preview */}
        {(project?.startDate || project?.endDate) && (
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Project Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-8">
                {project?.startDate && (
                  <div className="text-center">
                    <div className="text-white/60 text-sm mb-1">Start Date</div>
                    <div className="text-white">
                      {new Date(project.startDate).toLocaleDateString()}
                    </div>
                  </div>
                )}
                {project?.endDate && (
                  <div className="text-center">
                    <div className="text-white/60 text-sm mb-1">End Date</div>
                    <div className="text-white">
                      {new Date(project.endDate).toLocaleDateString()}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </ProjectLayout>
  );
}