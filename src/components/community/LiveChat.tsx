import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Users, Circle } from "lucide-react";
import { motion } from "framer-motion";

const LiveChat = () => {
  const [message, setMessage] = useState("");
  const [activeUsers] = useState(23);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const messages = [
    {
      id: 1,
      user: "Priya",
      avatar: "P",
      message: "Good morning everyone! Has anyone tried the new breakfast combo?",
      time: "09:15 AM",
      isOnline: true
    },
    {
      id: 2,
      user: "Rahul",
      avatar: "R",
      message: "Yes! Had it yesterday. The paratha was amazing! 🍳",
      time: "09:16 AM",
      isOnline: true
    },
    {
      id: 3,
      user: "Sneha",
      avatar: "S",
      message: "I'm planning to visit this afternoon. Any recommendations?",
      time: "09:18 AM",
      isOnline: false
    },
    {
      id: 4,
      user: "Ahmed",
      avatar: "A",
      message: "Definitely try the khichuri if you want comfort food!",
      time: "09:20 AM",
      isOnline: true
    },
    {
      id: 5,
      user: "Fatima",
      avatar: "F",
      message: "The coffee is really good too ☕ Perfect for this weather",
      time: "09:22 AM",
      isOnline: true
    },
    {
      id: 6,
      user: "Karim",
      avatar: "K",
      message: "Anyone know if they're taking pre-orders for weekend biryani?",
      time: "09:25 AM",
      isOnline: false
    },
    {
      id: 7,
      user: "Nisha",
      avatar: "N",
      message: "Yes! I just placed my order for Saturday. Call them directly 📞",
      time: "09:27 AM",
      isOnline: true
    }
  ];

  const onlineUsers = [
    { name: "Priya", avatar: "P", status: "Just ordered breakfast" },
    { name: "Rahul", avatar: "R", status: "At Tiffin Table now" },
    { name: "Ahmed", avatar: "A", status: "Planning lunch visit" },
    { name: "Fatima", avatar: "F", status: "Loving the coffee" },
    { name: "Nisha", avatar: "N", status: "Pre-ordered for weekend" }
  ];

  const handleSendMessage = () => {
    if (message.trim()) {
      // Handle message sending
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [messages]);

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Main Chat */}
      <div className="lg:col-span-2">
        <Card className="h-[600px] flex flex-col">
          <CardHeader className="border-b border-border">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                💬 Live Community Chat
                <Badge className="bg-green-500 text-white">
                  <Circle className="w-2 h-2 mr-1 fill-current" />
                  Live
                </Badge>
              </CardTitle>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="w-4 h-4" />
                <span>{activeUsers} online</span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="flex-1 p-0 flex flex-col">
            {/* Messages */}
            <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
              <div className="space-y-4">
                {messages.map((msg, index) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-start gap-3"
                  >
                    <div className="relative">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src="/placeholder.svg" />
                        <AvatarFallback className="text-xs">{msg.avatar}</AvatarFallback>
                      </Avatar>
                      {msg.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-background rounded-full"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">{msg.user}</span>
                        <span className="text-xs text-muted-foreground">{msg.time}</span>
                      </div>
                      <div className="bg-muted rounded-lg px-3 py-2 max-w-md">
                        <p className="text-sm">{msg.message}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="border-t border-border p-4">
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Type your message... Press Enter to send"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1"
                />
                <Button 
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  size="icon"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Online Users Sidebar */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="w-5 h-5" />
              Online Now ({onlineUsers.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {onlineUsers.map((user, index) => (
              <motion.div
                key={user.name}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors cursor-pointer"
              >
                <div className="relative">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback>{user.avatar}</AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-background rounded-full"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{user.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.status}</p>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>

        {/* Chat Guidelines */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Chat Guidelines</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>• Be respectful to all community members</p>
            <p>• Share your honest food experiences</p>
            <p>• Help others with recommendations</p>
            <p>• Keep conversations food-related</p>
            <p>• No spam or promotional content</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LiveChat;