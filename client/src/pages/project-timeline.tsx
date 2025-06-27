import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Clock, CheckCircle, AlertCircle, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ProjectLayout from "./project-layout";

export default function ProjectTimeline() {
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
          <div className="text-white font-mono">Loading timeline...</div>
        </div>
      </ProjectLayout>
    );
  }

  // Sample timeline events (you can replace with real data)
  const timelineEvents = [
    {
      id: 1,
      title: "Project Started",
      description: "Initial project setup and requirements gathering",
      date: (project as any)?.startDate || new Date().toISOString(),
      type: "milestone",
      completed: true
    },
    {
      id: 2,
      title: "Design Phase",
      description: "UI/UX design and wireframes",
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      type: "phase",
      completed: true
    },
    {
      id: 3,
      title: "Development Phase",
      description: "Frontend and backend development",
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      type: "phase",
      completed: false
    },
    {
      id: 4,
      title: "Testing & Launch",
      description: "Quality assurance and deployment",
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      type: "milestone",
      completed: false
    }
  ];

  const getEventIcon = (type: string, completed: boolean) => {
    if (completed) {
      return <CheckCircle className="w-6 h-6 text-white" />;
    }
    switch (type) {
      case "milestone":
        return <AlertCircle className="w-6 h-6 text-white" />;
      default:
        return <Clock className="w-6 h-6 text-white" />;
    }
  };

  return (
    <ProjectLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white font-mono mb-2">Project Timeline</h1>
          <p className="text-white font-mono">Track project milestones and progress</p>
        </div>

        {/* Timeline */}
        <div className="space-y-6">
          {timelineEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start space-x-4"
            >
              {/* Timeline line */}
              <div className="flex flex-col items-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  event.completed ? 'bg-white' : 'bg-black border-2 border-white'
                }`}>
                  {getEventIcon(event.type, event.completed)}
                </div>
                {index < timelineEvents.length - 1 && (
                  <div className="w-0.5 h-16 bg-white mt-2" />
                )}
              </div>

              {/* Event content */}
              <div className="flex-1 pb-8">
                <Card className="bg-black border-white">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white font-mono">{event.title}</CardTitle>
                      <div className="flex items-center space-x-2">
                        <Badge className={`font-mono ${
                          event.completed ? 'bg-white text-black' : 'bg-black text-white border-white'
                        }`}>
                          {event.completed ? 'Completed' : 'Upcoming'}
                        </Badge>
                        <div className="flex items-center text-white font-mono text-sm">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(event.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-white font-mono">{event.description}</p>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Progress Summary */}
        <Card className="bg-black border-white">
          <CardHeader>
            <CardTitle className="text-white font-mono">Progress Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-white font-mono">
                  {timelineEvents.filter(e => e.completed).length}
                </div>
                <div className="text-white font-mono text-sm">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white font-mono">
                  {timelineEvents.filter(e => !e.completed).length}
                </div>
                <div className="text-white font-mono text-sm">Remaining</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white font-mono">
                  {Math.round((timelineEvents.filter(e => e.completed).length / timelineEvents.length) * 100)}%
                </div>
                <div className="text-white font-mono text-sm">Complete</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ProjectLayout>
  );
}