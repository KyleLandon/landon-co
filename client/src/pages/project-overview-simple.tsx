import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { 
  Calendar, 
  DollarSign, 
  MessageCircle, 
  CheckCircle, 
  TrendingUp
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ProjectLayout from "./project-layout";

export default function ProjectOverviewSimple() {
  const { id } = useParams();

  const { data: project, isLoading } = useQuery({
    queryKey: [`/api/projects/${id}`],
    enabled: !!id,
  });

  const { data: messages } = useQuery({
    queryKey: [`/api/projects/${id}/messages`],
    enabled: !!id,
  });

  const { data: updates } = useQuery({
    queryKey: [`/api/projects/${id}/updates`],
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <ProjectLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-400 font-mono">Loading project...</div>
        </div>
      </ProjectLayout>
    );
  }

  if (!project) {
    return (
      <ProjectLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-400 font-mono">Project not found</div>
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

  const messageCount = Array.isArray(messages) ? messages.length : 0;
  const updateCount = Array.isArray(updates) ? updates.length : 0;
  const completedUpdates = Array.isArray(updates) ? updates.filter((update: any) => update.isCompleted).length : 0;

  const stats = [
    {
      title: "Total Budget",
      value: (project as any)?.budget ? `$${parseInt((project as any).budget).toLocaleString()}` : "TBD",
      icon: DollarSign,
      color: "text-white"
    },
    {
      title: "Messages",
      value: messageCount,
      icon: MessageCircle,
      color: "text-white"
    },
    {
      title: "Updates",
      value: `${completedUpdates}/${updateCount}`,
      icon: CheckCircle,
      color: "text-white"
    },
    {
      title: "Progress",
      value: updateCount > 0 ? `${Math.round((completedUpdates / updateCount) * 100)}%` : "0%",
      icon: TrendingUp,
      color: "text-white"
    }
  ];

  return (
    <ProjectLayout>
      <div className="space-y-6">
        {/* Project Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white font-mono mb-2">
              {(project as any)?.title || "Project"}
            </h1>
            <p className="text-gray-400 font-mono mb-4">
              {(project as any)?.description || "Project description"}
            </p>
            <div className="flex items-center space-x-4">
              <Badge className={`${getStatusColor((project as any)?.status || "proposal")} text-white font-mono`}>
                {getStatusText((project as any)?.status || "proposal")}
              </Badge>
              {(project as any)?.startDate && (
                <div className="flex items-center text-gray-400 font-mono text-sm">
                  <Calendar className="w-4 h-4 mr-1" />
                  Started {new Date((project as any).startDate).toLocaleDateString()}
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
              <Card className="bg-black border-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-mono text-sm">{stat.title}</p>
                      <p className="text-2xl font-bold text-white font-mono">{stat.value}</p>
                    </div>
                    <stat.icon className={`w-8 h-8 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Messages */}
          <Card className="bg-black border-white">
            <CardHeader>
              <CardTitle className="text-white font-mono flex items-center">
                <MessageCircle className="w-5 h-5 mr-2" />
                Recent Messages
              </CardTitle>
            </CardHeader>
            <CardContent>
              {messageCount > 0 ? (
                <div className="space-y-3">
                  {Array.isArray(messages) && messages.slice(-3).map((message: any) => (
                    <div key={message.id} className="p-3 bg-black border border-white rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-white font-mono">
                          {message.senderId === (project as any)?.clientId ? "You" : "Admin"}
                        </span>
                        <span className="text-xs text-white font-mono">
                          {new Date(message.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-white font-mono text-sm line-clamp-2">
                        {message.message}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-white font-mono text-center py-4">
                  No messages yet
                </p>
              )}
            </CardContent>
          </Card>

          {/* Project Info */}
          <Card className="bg-black border-white">
            <CardHeader>
              <CardTitle className="text-white font-mono flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                Project Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-white font-mono mb-1">Status</div>
                  <div className="text-white font-mono">
                    {getStatusText((project as any)?.status || "proposal")}
                  </div>
                </div>
                {(project as any)?.startDate && (
                  <div>
                    <div className="text-sm text-white font-mono mb-1">Start Date</div>
                    <div className="text-white font-mono">
                      {new Date((project as any).startDate).toLocaleDateString()}
                    </div>
                  </div>
                )}
                {(project as any)?.endDate && (
                  <div>
                    <div className="text-sm text-white font-mono mb-1">Expected Completion</div>
                    <div className="text-white font-mono">
                      {new Date((project as any).endDate).toLocaleDateString()}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProjectLayout>
  );
}