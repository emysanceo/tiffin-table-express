import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CommunityFeed from "./CommunityFeed";
import LiveChat from "./LiveChat";
import CommunityGroups from "./CommunityGroups";
import ReviewsSection from "./ReviewsSection";
import { MessageSquare, Users, Star, Home } from "lucide-react";

const CommunityTabs = () => {
  return (
    <Tabs defaultValue="feed" className="w-full">
      <TabsList className="grid w-full grid-cols-4 mb-8">
        <TabsTrigger value="feed" className="flex items-center gap-2">
          <Home className="w-4 h-4" />
          <span className="hidden sm:inline">Feed</span>
        </TabsTrigger>
        <TabsTrigger value="chat" className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4" />
          <span className="hidden sm:inline">Live Chat</span>
        </TabsTrigger>
        <TabsTrigger value="groups" className="flex items-center gap-2">
          <Users className="w-4 h-4" />
          <span className="hidden sm:inline">Groups</span>
        </TabsTrigger>
        <TabsTrigger value="reviews" className="flex items-center gap-2">
          <Star className="w-4 h-4" />
          <span className="hidden sm:inline">Reviews</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="feed">
        <CommunityFeed />
      </TabsContent>

      <TabsContent value="chat">
        <LiveChat />
      </TabsContent>

      <TabsContent value="groups">
        <CommunityGroups />
      </TabsContent>

      <TabsContent value="reviews">
        <ReviewsSection />
      </TabsContent>
    </Tabs>
  );
};

export default CommunityTabs;