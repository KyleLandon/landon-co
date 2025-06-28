import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import AppleMessaging from "@/components/apple-messaging";
import ProjectLayout from "./project-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Message } from "@shared/schema";

export default function ProjectMessages() {
  const { id } = useParams();
  const { user } = useAuth();

  const { data: messages, isLoading } = useQuery<Message[]>({
    queryKey: [`/api/projects/${id}/messages`],
    enabled: !!id,
    refetchInterval: 3000, // Auto-refresh every 3 seconds
  });

  if (isLoading) {
    return (
      <ProjectLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-400 font-mono">Loading messages...</div>
        </div>
      </ProjectLayout>
    );
  }

  return (
    <ProjectLayout>
      <div className="h-full">
        <Card className="bg-gray-900 border-gray-800 h-[calc(100vh-200px)]">
          <CardHeader>
            <CardTitle className="text-white font-mono">Messages</CardTitle>
          </CardHeader>
          <CardContent className="p-0 h-full">
            <div className="h-full">
              <AppleMessaging
                projectId={id || ""}
                messages={(messages || []).map(msg => ({
                  id: msg.id,
                  senderId: msg.senderId,
                  message: msg.message,
                  createdAt: msg.createdAt || new Date(),
                  replyTo: msg.replyTo || undefined
                }))}
                currentUserId={user?.id || ""}
                isAdmin={false}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </ProjectLayout>
  );
}