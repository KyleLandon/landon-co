import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FolderOpen, Users, MessageSquare, Clock, DollarSign, TrendingUp, Activity } from "lucide-react";
import { Link } from "wouter";
import AdminLayout from "@/pages/admin-layout";

export default function AdminDashboard() {
  // Fetch dashboard stats
  const { data: stats } = useQuery<any>({
    queryKey: ["/api/admin/stats"],
  });

  const { data: projects = [] } = useQuery<any[]>({
    queryKey: ["/api/admin/projects"],
  });

  const { data: users = [] } = useQuery<any[]>({
    queryKey: ["/api/admin/users"],
  });

  const { data: contacts = [] } = useQuery<any[]>({
    queryKey: ["/api/admin/contacts"],
  });

  const { data: submissions = [] } = useQuery<any[]>({
    queryKey: ["/api/admin/project-submissions"],
  });

  const quickStats = [
    {
      title: "Total Projects",
      value: projects.length,
      icon: FolderOpen,
      color: "text-blue-400",
      href: "/admin/projects"
    },
    {
      title: "Active Clients",
      value: users.length,
      icon: Users,
      color: "text-green-400",
      href: "/admin/clients"
    },
    {
      title: "Messages",
      value: contacts.length + submissions.length,
      icon: MessageSquare,
      color: "text-yellow-400",
      href: "/admin/messages"
    },
    {
      title: "Revenue",
      value: `$${projects.reduce((sum: number, p: any) => sum + (parseFloat(p.budget) || 0), 0).toLocaleString()}`,
      icon: DollarSign,
      color: "text-purple-400",
      href: "/admin/projects"
    }
  ];

  const recentActivity = [
    ...projects.slice(0, 3).map((project: any) => ({
      type: "project",
      title: `Project: ${project.title}`,
      description: `Client: ${project.clientId}`,
      time: project.createdAt,
      color: "text-blue-400"
    })),
    ...contacts.slice(0, 2).map((contact: any) => ({
      type: "contact",
      title: `Contact: ${contact.name}`,
      description: contact.project,
      time: contact.createdAt,
      color: "text-green-400"
    }))
  ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 5);

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Welcome Header */}
        <div>
          <h1 className="text-3xl font-mono font-bold text-white">Admin Dashboard</h1>
          <p className="text-gray-400 font-mono mt-1">Welcome back! Here's what's happening with your business.</p>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickStats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={stat.href}>
                <Card className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-colors cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 font-mono text-sm">{stat.title}</p>
                        <p className="text-2xl font-mono font-bold text-white mt-1">{stat.value}</p>
                      </div>
                      <stat.icon className={`w-8 h-8 ${stat.color}`} />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white font-mono flex items-center">
                  <Activity className="w-5 h-5 mr-2" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.length > 0 ? (
                    recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-gray-400 rounded-full mt-2"></div>
                        <div className="flex-1">
                          <p className="text-white font-mono text-sm">{activity.title}</p>
                          <p className="text-gray-400 font-mono text-xs">{activity.description}</p>
                          <p className="text-gray-500 font-mono text-xs">
                            {activity.time ? new Date(activity.time).toLocaleDateString() : 'Recently'}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 font-mono text-center py-8">No recent activity</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white font-mono flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Link href="/admin/projects">
                    <Button className="w-full bg-gray-800 text-white hover:bg-gray-700 font-mono justify-start">
                      <FolderOpen className="w-4 h-4 mr-2" />
                      Manage Projects
                    </Button>
                  </Link>
                  <Link href="/admin/clients">
                    <Button className="w-full bg-transparent border-gray-700 text-white hover:bg-gray-800 font-mono justify-start" variant="outline">
                      <Users className="w-4 h-4 mr-2" />
                      View Clients
                    </Button>
                  </Link>
                  <Link href="/admin/messages">
                    <Button className="w-full bg-transparent border-gray-700 text-white hover:bg-gray-800 font-mono justify-start" variant="outline">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Check Messages
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Project Status Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white font-mono">Project Status Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {['inquiry', 'proposal', 'active', 'completed', 'pending'].map((status) => {
                  const count = projects.filter((p: any) => p.status === status).length;
                  const getStatusColor = (status: string) => {
                    switch (status) {
                      case "active": return "text-green-400";
                      case "proposal": return "text-yellow-400";
                      case "completed": return "text-blue-400";
                      case "pending": return "text-orange-400";
                      case "inquiry": return "text-gray-400";
                      default: return "text-gray-400";
                    }
                  };
                  
                  return (
                    <div key={status} className="text-center">
                      <div className={`text-2xl font-mono font-bold ${getStatusColor(status)}`}>
                        {count}
                      </div>
                      <div className="text-sm font-mono text-gray-400 capitalize">
                        {status}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AdminLayout>
  );
}