import { useState, useRef, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Smile } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface MessageType {
  id: number;
  senderId: string;
  message: string;
  createdAt: string | Date | null;
  replyTo?: number | null;
}

interface AppleMessagingProps {
  projectId: string;
  messages: MessageType[];
  currentUserId: string;
  isAdmin: boolean;
}

// Typing indicator component with Apple-style dots
const TypingIndicator = ({ senderName }: { senderName: string }) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    className="flex items-end mb-3 ml-2"
  >
    <div className="bg-gray-200 rounded-2xl px-4 py-3 shadow-sm">
      <div className="flex space-x-1">
        <motion.div 
          className="w-2 h-2 bg-gray-500 rounded-full"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
        />
        <motion.div 
          className="w-2 h-2 bg-gray-500 rounded-full"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
        />
        <motion.div 
          className="w-2 h-2 bg-gray-500 rounded-full"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
        />
      </div>
    </div>
  </motion.div>
);

export default function AppleMessaging({ 
  projectId, 
  messages, 
  currentUserId, 
  isAdmin 
}: AppleMessagingProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messageText, setMessageText] = useState("");
  const [replyingTo, setReplyingTo] = useState<MessageType | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const [lastActivity, setLastActivity] = useState<number>(Date.now());

  // Notification sound for new messages
  const playMessageSound = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(520, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(660, audioContext.currentTime + 0.1);
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (error) {
      console.log('Audio not available or blocked by browser');
    }
  };

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
      setIsTyping(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    },
  });

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Track previous message count for new message detection
  const [previousMessageCount, setPreviousMessageCount] = useState(0);

  useEffect(() => {
    if (messages && messages.length > previousMessageCount && previousMessageCount > 0) {
      const latestMessage = messages[messages.length - 1];
      if (latestMessage.senderId !== currentUserId) {
        playMessageSound();
      }
    }
    setPreviousMessageCount(messages?.length || 0);
  }, [messages, currentUserId, previousMessageCount]);

  // Simulate typing detection (in real app, this would come from WebSocket)
  useEffect(() => {
    let typingTimer: NodeJS.Timeout | undefined;
    
    if (messageText.trim()) {
      setIsTyping(true);
      if (typingTimer) clearTimeout(typingTimer);
      typingTimer = setTimeout(() => {
        setIsTyping(false);
      }, 1000);
    } else {
      setIsTyping(false);
    }

    return () => {
      if (typingTimer) clearTimeout(typingTimer);
    };
  }, [messageText]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageText.trim()) {
      sendMessageMutation.mutate({
        message: messageText,
        replyTo: replyingTo?.id
      });
    }
  };

  const formatTime = (timestamp: string | Date | null) => {
    if (!timestamp) return '';
    const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const isFromCurrentUser = (senderId: string) => senderId === currentUserId;

  return (
    <div className="flex flex-col h-full bg-white max-h-full">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 min-h-0">
        <AnimatePresence>
          {messages.map((message, index) => {
            const isOwn = isFromCurrentUser(message.senderId);
            const showAvatar = index === 0 || messages[index - 1].senderId !== message.senderId;
            
            return (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-1`}
              >
                <div className={`flex max-w-xs lg:max-w-md ${isOwn ? 'flex-row-reverse' : 'flex-row'} items-end`}>
                  {/* Avatar placeholder for other users */}
                  {!isOwn && showAvatar && (
                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center mr-2 flex-shrink-0">
                      <span className="text-xs font-medium text-gray-600">
                        {isAdmin ? 'C' : 'A'}
                      </span>
                    </div>
                  )}
                  {!isOwn && !showAvatar && <div className="w-8 mr-2" />}
                  
                  {/* Message Bubble */}
                  <div
                    className={`px-4 py-2 rounded-2xl max-w-full break-words shadow-sm ${
                      isOwn
                        ? 'bg-blue-500 text-white rounded-br-md'
                        : 'bg-gray-200 text-gray-900 rounded-bl-md'
                    }`}
                  >
                    {/* Reply indicator */}
                    {message.replyTo && (
                      <div className={`text-xs mb-1 opacity-75 ${isOwn ? 'text-blue-100' : 'text-gray-600'}`}>
                        Replying to previous message
                      </div>
                    )}
                    
                    {/* Message text */}
                    <div className="text-sm leading-relaxed">{message.message}</div>
                    
                    {/* Timestamp */}
                    <div className={`text-xs mt-1 ${isOwn ? 'text-blue-100' : 'text-gray-500'}`}>
                      {formatTime(message.createdAt)}
                    </div>
                  </div>
                  
                  {/* Avatar placeholder for own messages */}
                  {isOwn && showAvatar && (
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center ml-2 flex-shrink-0">
                      <span className="text-xs font-medium text-white">
                        {isAdmin ? 'A' : 'C'}
                      </span>
                    </div>
                  )}
                  {isOwn && !showAvatar && <div className="w-8 ml-2" />}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        
        {/* Typing Indicator */}
        <AnimatePresence>
          {typingUsers.size > 0 && (
            <TypingIndicator senderName={isAdmin ? "Client" : "Admin"} />
          )}
        </AnimatePresence>
        
        <div ref={messagesEndRef} />
      </div>

      {/* Reply Banner */}
      <AnimatePresence>
        {replyingTo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="px-4 py-2 bg-gray-50 border-t border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="text-xs text-gray-500 mb-1">Replying to:</div>
                <div className="text-sm text-gray-700 truncate">{replyingTo.message}</div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setReplyingTo(null)}
                className="ml-2 text-gray-400 hover:text-gray-600"
              >
                ×
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
          {/* Emoji Button */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-gray-600"
          >
            <Smile className="w-5 h-5" />
          </Button>

          {/* Message Input */}
          <div className="flex-1 relative">
            <Input
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="iMessage"
              className="rounded-full border-gray-300 bg-gray-50 px-4 py-2 pr-12 text-gray-900 placeholder:text-gray-500 focus:bg-white focus:border-blue-500 focus:ring-blue-500"
              disabled={sendMessageMutation.isPending}
            />
          </div>

          {/* Send Button */}
          <Button 
            type="submit" 
            size="icon"
            disabled={sendMessageMutation.isPending || !messageText.trim()}
            className="rounded-full bg-blue-500 hover:bg-blue-600 text-white disabled:bg-gray-300"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}