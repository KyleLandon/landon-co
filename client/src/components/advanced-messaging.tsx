import { useState, useRef, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Send, 
  Paperclip, 
  Image, 
  Smile, 
  Search, 
  X,
  Download,
  User,
  Reply
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface MessageType {
  id: number;
  senderId: string;
  message: string;
  createdAt: string | Date;
  attachments?: Attachment[];
  replyTo?: number;
}

interface Attachment {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'file';
  size: number;
}

interface AdvancedMessagingProps {
  projectId: string;
  messages: MessageType[];
  currentUserId: string;
  isAdmin: boolean;
}

const EMOJI_LIST = [
  '😀', '😂', '😍', '🤔', '👍', '👎', '❤️', '🔥', '💯', '🎉',
  '😊', '😎', '🤗', '😴', '🙄', '😬', '🤯', '🥳', '😇', '🤓',
  '💪', '🚀', '⭐', '✅', '❌', '⚡', '💡', '🎯', '🔧', '🎨'
];

export default function AdvancedMessaging({ 
  projectId, 
  messages, 
  currentUserId, 
  isAdmin 
}: AdvancedMessagingProps) {
  const [messageText, setMessageText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [replyingTo, setReplyingTo] = useState<MessageType | null>(null);
  const [attachments, setAttachments] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const sendMessageMutation = useMutation({
    mutationFn: async (data: { message: string; replyTo?: number }) => {
      return apiRequest("POST", `/api/projects/${projectId}/messages`, {
        message: data.message,
        replyTo: data.replyTo
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/projects/${projectId}/messages`] });
      setMessageText("");
      setReplyingTo(null);
      toast({
        title: "Message sent",
        description: "Your message has been sent successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    },
  });

  // Filter messages based on search
  const filteredMessages = messages.filter(message =>
    message.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageText.trim()) {
      sendMessageMutation.mutate({
        message: messageText,
        replyTo: replyingTo?.id
      });
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachments(prev => [...prev, ...files]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const addEmoji = (emoji: string) => {
    setMessageText(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getSenderName = (senderId: string) => {
    return senderId === currentUserId ? "You" : isAdmin ? "Client" : "Admin";
  };

  const getReplyMessage = (replyId: number) => {
    return messages.find(m => m.id === replyId);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Search Bar */}
      <div className="p-4 border-b border-white/10">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-black border-white/20 text-white font-mono"
          />
        </div>
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {filteredMessages.map((message) => {
            const replyMessage = message.replyTo ? getReplyMessage(message.replyTo) : null;
            
            return (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`flex ${message.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[70%] ${
                  message.senderId === currentUserId 
                    ? 'bg-white text-black' 
                    : 'bg-gray-800 text-white'
                } rounded-lg p-3 font-mono`}>
                  
                  {/* Reply Reference */}
                  {replyMessage && (
                    <div className="mb-2 p-2 bg-black/20 rounded border-l-2 border-blue-400">
                      <div className="text-xs text-gray-400 mb-1">
                        Replying to {getSenderName(replyMessage.senderId)}
                      </div>
                      <div className="text-sm opacity-75 line-clamp-2">
                        {replyMessage.message}
                      </div>
                    </div>
                  )}

                  {/* Sender & Time */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold">
                      {getSenderName(message.senderId)}
                    </span>
                    <span className="text-xs opacity-60">
                      {typeof message.createdAt === 'string' 
                        ? new Date(message.createdAt).toLocaleTimeString()
                        : message.createdAt.toLocaleTimeString()
                      }
                    </span>
                  </div>

                  {/* Message Content */}
                  <div className="text-sm whitespace-pre-wrap">
                    {message.message}
                  </div>

                  {/* Attachments */}
                  {message.attachments && message.attachments.length > 0 && (
                    <div className="mt-2 space-y-2">
                      {message.attachments.map((attachment) => (
                        <div
                          key={attachment.id}
                          className="flex items-center gap-2 p-2 bg-black/20 rounded"
                        >
                          {attachment.type === 'image' ? (
                            <Image className="w-4 h-4" />
                          ) : (
                            <Paperclip className="w-4 h-4" />
                          )}
                          <span className="text-xs flex-1 truncate">
                            {attachment.name}
                          </span>
                          <span className="text-xs opacity-60">
                            {formatFileSize(attachment.size)}
                          </span>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0"
                            onClick={() => window.open(attachment.url, '_blank')}
                          >
                            <Download className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Reply Button */}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 mt-2 text-xs"
                    onClick={() => setReplyingTo(message)}
                  >
                    <Reply className="w-3 h-3 mr-1" />
                    Reply
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Reply Bar */}
      {replyingTo && (
        <div className="p-3 bg-gray-800 border-t border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="text-xs text-blue-400 mb-1">
                Replying to {getSenderName(replyingTo.senderId)}
              </div>
              <div className="text-sm text-gray-300 line-clamp-1">
                {replyingTo.message}
              </div>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setReplyingTo(null)}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}



      {/* Message Input */}
      <div className="p-4 border-t border-white/10">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          {/* Attachment Button */}
          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={() => fileInputRef.current?.click()}
            className="text-gray-400 hover:text-white"
          >
            <Paperclip className="w-4 h-4" />
          </Button>

          {/* Emoji Button */}
          <div className="relative">
            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="text-gray-400 hover:text-white"
            >
              <Smile className="w-4 h-4" />
            </Button>

            {/* Emoji Picker */}
            {showEmojiPicker && (
              <div className="absolute bottom-12 left-0 bg-black border border-white/20 rounded-lg p-3 grid grid-cols-6 gap-2 z-10">
                {EMOJI_LIST.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => addEmoji(emoji)}
                    className="hover:bg-gray-800 p-1 rounded text-lg"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Message Input */}
          <Input
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-black border-white/20 text-white placeholder:text-gray-400 font-mono"
            disabled={sendMessageMutation.isPending}
          />

          {/* Send Button */}
          <Button 
            type="submit" 
            size="icon"
            disabled={sendMessageMutation.isPending || !messageText.trim()}
            className="bg-white text-black hover:bg-gray-200"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          accept="image/*,.pdf,.doc,.docx,.txt"
        />
      </div>

      {/* Click outside to close emoji picker */}
      {showEmojiPicker && (
        <div
          className="fixed inset-0 z-5"
          onClick={() => setShowEmojiPicker(false)}
        />
      )}
    </div>
  );
}