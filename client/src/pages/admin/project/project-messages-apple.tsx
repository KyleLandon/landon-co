import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { MessageCircle, User, Clock } from "lucide-react";
import AdminLayout from "../admin-layout";
import AppleMessaging from "@/components/apple-messaging";
import type { Project, Message, User as UserType } from "@shared/schema";

export default function AdminProjectMessages() {
  const { id } = useParams();
  const { user } = useAuth();

  const { data: project } = useQuery<Project>({
    queryKey: [`/api/projects/${id}`],
    enabled: !!id,
  });

  const { data: client } = useQuery<UserType>({
    queryKey: [`/api/users/${project?.clientId}`],
    enabled: !!project?.clientId,
  });

  const { data: messages, isLoading: messagesLoading } = useQuery<Message[]>({
    queryKey: [`/api/projects/${id}/messages`],
    enabled: !!id,
    refetchInterval: 3000, // Auto-refresh every 3 seconds
  });

  if (!id) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="text-center text-gray-500">No project selected</div>
        </div>
      </AdminLayout>
    );
  }

  if (messagesLoading) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="text-center text-gray-500">Loading messages...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 font-mono">
                Messages
              </h1>
              <p className="text-gray-600 font-mono">
                Communicate with Client about {project?.title || 'Project'}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="font-mono">
                <MessageCircle className="w-3 h-3 mr-1" />
                {messages?.length || 0} total messages
              </Badge>
              {client && (
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600 font-mono">
                    {client.firstName && client.lastName 
                      ? `${client.firstName} ${client.lastName}`
                      : client.email
                    }
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Conversation Section */}
        <div className="flex-1 overflow-hidden">
          <Card className="h-full border-0 rounded-none shadow-none">
            <CardHeader className="pb-2 bg-gray-50">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <CardTitle className="text-lg font-mono">Conversation</CardTitle>
              </div>
              <CardDescription className="font-mono">
                Messages refresh automatically every 3 seconds
              </CardDescription>
            </CardHeader>
            
            <CardContent className="p-0 h-full overflow-hidden">
              <div className="h-full max-h-[500px]">
                <AppleMessaging
                  projectId={id}
                  messages={(messages || []).map(msg => ({
                    id: msg.id,
                    senderId: msg.senderId,
                    message: msg.message,
                    createdAt: msg.createdAt || new Date(),
                    replyTo: msg.replyTo || undefined
                  }))}
                  currentUserId={user?.id || ""}
                  isAdmin={true}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}