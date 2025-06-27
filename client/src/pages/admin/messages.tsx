import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Search, Filter, Mail, Phone, MessageSquare, Calendar, Eye, CheckCircle, ArrowRight } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import AdminLayout from "./admin-layout";

export default function AdminMessages() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [selectedMessage, setSelectedMessage] = useState<any>(null);

  // Fetch contacts and project submissions
  const { data: contacts = [], isLoading: contactsLoading } = useQuery<any[]>({
    queryKey: ["/api/admin/contacts"],
  });

  const { data: submissions = [], isLoading: submissionsLoading } = useQuery<any[]>({
    queryKey: ["/api/admin/project-submissions"],
  });

  // Create project from submission mutation
  const createProjectMutation = useMutation({
    mutationFn: async (submissionId: number) => {
      const submission = submissions.find((s: any) => s.id === submissionId);
      if (!submission) throw new Error("Submission not found");

      // First create the project
      const projectData = {
        clientId: submission.userId,
        title: `${submission.projectType} Project - ${submission.name}`,
        description: submission.description || submission.message,
        status: "proposal",
        budget: submission.budget ? parseFloat(submission.budget.replace(/\D/g, '')) : undefined,
      };

      const projectRes = await apiRequest("POST", "/api/admin/projects", projectData);
      const project = await projectRes.json();

      // Then update submission status
      await apiRequest("PATCH", `/api/admin/project-submissions/${submissionId}`, { status: "converted" });

      return project;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/projects"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/project-submissions"] });
      setSelectedMessage(null);
      toast({
        title: "Success",
        description: "Project created successfully from submission",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create project",
        variant: "destructive",
      });
    },
  });

  // Combine and format messages
  const allMessages = [
    ...contacts.map((contact: any) => ({
      ...contact,
      type: 'contact',
      title: `Contact Form - ${contact.project}`,
      date: contact.createdAt,
      status: 'unread'
    })),
    ...submissions.map((submission: any) => ({
      ...submission,
      type: 'submission',
      title: `Project Request - ${submission.projectType}`,
      date: submission.createdAt,
      status: submission.status || 'pending'
    }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const filteredMessages = allMessages.filter(message => {
    const matchesSearch = message.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || message.type === filterType;
    return matchesSearch && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "converted": return "bg-green-500";
      case "pending": return "bg-orange-500";
      case "unread": return "bg-blue-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "converted": return "Converted";
      case "pending": return "Pending";
      case "unread": return "New";
      default: return status;
    }
  };

  if (contactsLoading || submissionsLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400 font-mono">Loading messages...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-mono font-bold text-white">Messages</h1>
            <p className="text-gray-400 font-mono mt-1">Contact forms and project submissions</p>
          </div>
          <div className="flex gap-4 text-white font-mono text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold">{contacts.length}</div>
              <div className="text-gray-400">Contacts</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{submissions.length}</div>
              <div className="text-gray-400">Submissions</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-transparent border-white/20 text-white font-mono focus:border-white/40"
            />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-48 bg-transparent border-white/20 text-white font-mono">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-black border-white/20 text-white">
              <SelectItem value="all">All Messages</SelectItem>
              <SelectItem value="contact">Contact Forms</SelectItem>
              <SelectItem value="submission">Project Requests</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Messages List */}
        <div className="space-y-4">
          {filteredMessages.map((message: any) => (
            <motion.div
              key={`${message.type}-${message.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="bg-zinc-900 border-white/10 border-2 hover:border-white/20 transition-colors cursor-pointer"
                    onClick={() => setSelectedMessage(message)}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                          {message.type === 'contact' ? (
                            <Mail className="w-4 h-4 text-black" />
                          ) : (
                            <MessageSquare className="w-4 h-4 text-black" />
                          )}
                        </div>
                        <div>
                          <h3 className="text-white font-mono font-bold">{message.title}</h3>
                          <p className="text-gray-400 font-mono text-sm">From: {message.name} ({message.email})</p>
                        </div>
                      </div>
                      
                      <p className="text-gray-300 font-mono text-sm mb-3 line-clamp-2">
                        {message.message || message.description}
                      </p>
                      
                      <div className="flex items-center gap-4 text-xs font-mono">
                        <div className="flex items-center text-blue-400">
                          <Calendar className="w-3 h-3 mr-1" />
                          {new Date(message.date).toLocaleDateString()}
                        </div>
                        {message.phone && (
                          <div className="flex items-center text-green-400">
                            <Phone className="w-3 h-3 mr-1" />
                            {message.phone}
                          </div>
                        )}
                        {message.budget && (
                          <div className="text-yellow-400">
                            Budget: {message.budget}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Badge className={`${getStatusColor(message.status)} text-white font-mono text-xs`}>
                        {getStatusText(message.status)}
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-transparent border-white/20 text-white hover:bg-white/10 font-mono"
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        View
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredMessages.length === 0 && (
          <div className="text-center py-12">
            <MessageSquare className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-mono text-white mb-2">No Messages Found</h3>
            <p className="text-gray-400 font-mono">
              {searchTerm || filterType !== "all" ? "Try adjusting your filters" : "No messages received yet"}
            </p>
          </div>
        )}
      </div>

      {/* Message Detail Dialog */}
      {selectedMessage && (
        <Dialog open={!!selectedMessage} onOpenChange={() => setSelectedMessage(null)}>
          <DialogContent className="bg-black border-white/20 text-white max-w-2xl">
            <DialogHeader>
              <DialogTitle className="font-mono text-xl flex items-center">
                {selectedMessage.type === 'contact' ? (
                  <Mail className="w-5 h-5 mr-2" />
                ) : (
                  <MessageSquare className="w-5 h-5 mr-2" />
                )}
                {selectedMessage.title}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Contact Info */}
              <div className="border-b border-white/10 pb-4">
                <h3 className="font-mono font-bold text-white mb-3">Contact Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm font-mono">
                  <div>
                    <span className="text-gray-400">Name:</span>
                    <p className="text-white">{selectedMessage.name}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Email:</span>
                    <p className="text-white">{selectedMessage.email}</p>
                  </div>
                  {selectedMessage.phone && (
                    <div>
                      <span className="text-gray-400">Phone:</span>
                      <p className="text-white">{selectedMessage.phone}</p>
                    </div>
                  )}
                  <div>
                    <span className="text-gray-400">Date:</span>
                    <p className="text-white">{new Date(selectedMessage.date).toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Project Details */}
              {selectedMessage.type === 'submission' && (
                <div className="border-b border-white/10 pb-4">
                  <h3 className="font-mono font-bold text-white mb-3">Project Details</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm font-mono">
                    <div>
                      <span className="text-gray-400">Project Type:</span>
                      <p className="text-white">{selectedMessage.projectType}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Budget:</span>
                      <p className="text-white">{selectedMessage.budget || 'Not specified'}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Timeline:</span>
                      <p className="text-white">{selectedMessage.timeline || 'Not specified'}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Status:</span>
                      <Badge className={`${getStatusColor(selectedMessage.status)} text-white font-mono text-xs`}>
                        {getStatusText(selectedMessage.status)}
                      </Badge>
                    </div>
                  </div>
                </div>
              )}

              {/* Message Content */}
              <div>
                <h3 className="font-mono font-bold text-white mb-3">Message</h3>
                <div className="bg-zinc-800 border border-white/10 rounded p-4">
                  <p className="text-gray-300 font-mono text-sm whitespace-pre-wrap">
                    {selectedMessage.message || selectedMessage.description}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                {selectedMessage.type === 'submission' && selectedMessage.status !== 'converted' && (
                  <Button
                    onClick={() => createProjectMutation.mutate(selectedMessage.id)}
                    disabled={createProjectMutation.isPending}
                    className="bg-green-600 text-white hover:bg-green-700 font-mono"
                  >
                    {createProjectMutation.isPending ? (
                      "Creating..."
                    ) : (
                      <>
                        <ArrowRight className="w-4 h-4 mr-2" />
                        Convert to Project
                      </>
                    )}
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={() => window.open(`mailto:${selectedMessage.email}`, '_blank')}
                  className="bg-transparent border-white/20 text-white hover:bg-white/10 font-mono"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Reply via Email
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setSelectedMessage(null)}
                  className="bg-transparent border-white/20 text-white hover:bg-white/10 font-mono"
                >
                  Close
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </AdminLayout>
  );
}