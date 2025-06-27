import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Bookmark, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ProjectLayout from "./project-layout";

export default function ProjectUpdates() {
  const { id } = useParams();

  const { data: project, isLoading } = useQuery({
    queryKey: [`/api/projects/${id}`],
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
          <div className="text-white font-mono">Loading updates...</div>
        </div>
      </ProjectLayout>
    );
  }

  // Sample updates (replace with real data when available)
  const sampleUpdates = [
    {
      id: 1,
      title: "Homepage Design Complete",
      description: "Finished the main landing page design with responsive layout and animations",
      isCompleted: true,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      priority: "high"
    },
    {
      id: 2,
      title: "Database Schema Setup",
      description: "Configured PostgreSQL database with user authentication and project management tables",
      isCompleted: true,
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      priority: "medium"
    },
    {
      id: 3,
      title: "Contact Form Integration",
      description: "Working on email integration for contact form submissions",
      isCompleted: false,
      createdAt: new Date().toISOString(),
      priority: "high"
    }
  ];

  const allUpdates = Array.isArray(updates) && updates.length > 0 ? updates : sampleUpdates;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-white text-black';
      case 'medium': return 'bg-black text-white border-white';
      case 'low': return 'bg-black text-white border-white';
      default: return 'bg-black text-white border-white';
    }
  };

  const getStatusIcon = (completed: boolean) => {
    return completed ? (
      <CheckCircle className="w-5 h-5 text-white" />
    ) : (
      <Clock className="w-5 h-5 text-white" />
    );
  };

  return (
    <ProjectLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white font-mono mb-2">Project Updates</h1>
          <p className="text-white font-mono">Stay informed about project progress and milestones</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-black border-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-mono text-sm">Total Updates</p>
                  <p className="text-2xl font-bold text-white font-mono">{allUpdates.length}</p>
                </div>
                <Bookmark className="w-8 h-8 text-white" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black border-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-mono text-sm">Completed</p>
                  <p className="text-2xl font-bold text-white font-mono">
                    {allUpdates.filter((update: any) => update.isCompleted).length}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black border-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-mono text-sm">In Progress</p>
                  <p className="text-2xl font-bold text-white font-mono">
                    {allUpdates.filter((update: any) => !update.isCompleted).length}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-white" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Updates List */}
        <div className="space-y-4">
          {allUpdates.map((update: any, index: number) => (
            <motion.div
              key={update.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-black border-white">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      {getStatusIcon(update.isCompleted)}
                      <div>
                        <CardTitle className="text-white font-mono">{update.title}</CardTitle>
                        <p className="text-white font-mono text-sm mt-1">
                          {new Date(update.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={`font-mono ${getPriorityColor(update.priority || 'medium')}`}>
                        {(update.priority || 'medium').toUpperCase()}
                      </Badge>
                      <Badge className={`font-mono ${
                        update.isCompleted ? 'bg-white text-black' : 'bg-black text-white border-white'
                      }`}>
                        {update.isCompleted ? 'Completed' : 'In Progress'}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-white font-mono">{update.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {allUpdates.length === 0 && (
          <Card className="bg-black border-white text-center py-12">
            <CardContent className="pt-6">
              <AlertCircle className="w-16 h-16 text-white mx-auto mb-4" />
              <h3 className="text-xl font-mono font-bold mb-2 text-white">No Updates Yet</h3>
              <p className="text-white font-mono">
                Project updates will appear here as work progresses.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </ProjectLayout>
  );
}