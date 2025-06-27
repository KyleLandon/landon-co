import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import AdvancedMessaging from "@/components/advanced-messaging";
import ProjectLayout from "./project-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Message } from "@shared/schema";

// Convert database message format to component format
const convertMessages = (messages: Message[]) => {
  return messages.map(msg => ({
    id: msg.id,
    senderId: msg.senderId,
    message: msg.message,
    createdAt: msg.createdAt || new Date(),
    attachments: msg.attachments ? JSON.parse(msg.attachments) : undefined,
    replyTo: msg.replyTo || undefined
  }));
};

export default function ProjectMessages() {
  const { id } = useParams();
  const { user } = useAuth();

  const { data: messages, isLoading } = useQuery<Message[]>({
    queryKey: [`/api/projects/${id}/messages`],
    enabled: !!id,
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
              <AdvancedMessaging
                projectId={id || ""}
                messages={convertMessages(messages || [])}
                currentUserId={user?.id || ""}
                isAdmin={user?.role === "admin"}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </ProjectLayout>
  );
}