import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import heroImage from "@/assets/hero-breakfast.jpg";
import avocadoImage from "@/assets/avocado-toast.jpg";

const CommunityHighlights = () => {
  const highlights = [
    {
      user: "Rana Ahmed",
      time: "2 hours ago",
      content: "Just had the most amazing breakfast! The parathas remind me of home 🍳❤️",
      image: heroImage,
      likes: 24,
      comments: 8,
      avatar: "R"
    },
    {
      user: "Priya Sharma",
      time: "5 hours ago", 
      content: "This avocado toast is pure perfection! Worth every penny 🥑✨",
      image: avocadoImage,
      likes: 18,
      comments: 5,
      avatar: "P"
    }
  ];

  return (
    <section className="py-8 container-padding bg-muted/20">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Community Highlights</h2>
          <Button variant="ghost" className="text-primary">
            See More Stories
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          {highlights.map((post, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="community-post">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center mr-3">
                    <span className="text-primary-foreground font-semibold">
                      {post.avatar}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold">{post.user}</h4>
                    <p className="text-sm text-muted-foreground">{post.time}</p>
                  </div>
                </div>
                
                <p className="text-sm mb-3">{post.content}</p>
                
                <div className="aspect-video rounded-lg overflow-hidden mb-3">
                  <img 
                    src={post.image} 
                    alt="Community post"
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                      <Heart className="w-4 h-4" />
                      <span>{post.likes}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                      <MessageCircle className="w-4 h-4" />
                      <span>{post.comments}</span>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CommunityHighlights;