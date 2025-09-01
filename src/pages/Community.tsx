import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Heart, MessageCircle, Share2, Camera, Users, TrendingUp } from "lucide-react";

const Community = () => {
  const [newPost, setNewPost] = useState("");

  const posts = [
    {
      id: 1,
      user: {
        name: "Priya Sharma",
        avatar: "PS",
        badge: "Food Lover",
      },
      content: "Just had the most amazing avocado toast at Tiffin Table! The poached egg was perfectly runny 🍳✨",
      image: null,
      likes: 24,
      comments: 8,
      time: "2 hours ago",
      isLiked: false,
    },
    {
      id: 2,
      user: {
        name: "Rahul Gupta",
        avatar: "RG",
        badge: "Regular Customer",
      },
      content: "Nothing beats their khichuri on a rainy day. Comfort food at its finest! Who else is a fan? 🌧️",
      image: null,
      likes: 31,
      comments: 12,
      time: "5 hours ago",
      isLiked: true,
    },
    {
      id: 3,
      user: {
        name: "Sneha Patel",
        avatar: "SP",
        badge: "Community Star",
      },
      content: "Pre-ordered the special biryani for my family dinner this weekend. Can't wait! 🍛",
      image: null,
      likes: 18,
      comments: 5,
      time: "1 day ago",
      isLiked: false,
    },
  ];

  const trendingTopics = [
    { name: "Weekend Specials", count: 45 },
    { name: "Healthy Options", count: 32 },
    { name: "Comfort Food", count: 28 },
    { name: "Pre-orders", count: 15 },
  ];

  const communityHighlights = [
    {
      title: "Food Photo Contest",
      description: "Share your best Tiffin Table moments",
      participants: 156,
      prize: "Free meal for a week",
    },
    {
      title: "Recipe Exchange",
      description: "Share your favorite home recipes",
      participants: 89,
      prize: "Cooking workshop",
    },
  ];

  return (
    <div className="min-h-screen py-8 container-padding">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-gradient">Community</h1>
          <p className="text-muted-foreground">Connect with fellow food lovers</p>
        </div>

        {/* Community Highlights */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-primary" />
            Community Highlights
          </h2>
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            {communityHighlights.map((highlight, index) => (
              <Card key={index} className="card-hover cursor-pointer">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">{highlight.title}</h3>
                  <p className="text-muted-foreground text-sm mb-3">
                    {highlight.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Users className="w-4 h-4 mr-1" />
                      {highlight.participants} participants
                    </div>
                    <Badge className="bg-accent text-accent-foreground">
                      {highlight.prize}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Trending Topics */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Trending Now</h2>
          <div className="flex flex-wrap gap-2">
            {trendingTopics.map((topic, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className="cursor-pointer hover:bg-secondary/80 transition-colors"
              >
                #{topic.name} ({topic.count})
              </Badge>
            ))}
          </div>
        </section>

        {/* Create Post */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4">Share your story</h3>
            <Textarea
              placeholder="What's on your mind? Share your Tiffin Table experience..."
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              className="bg-input border-border mb-4"
              rows={3}
            />
            <div className="flex items-center justify-between">
              <Button variant="outline" size="sm" className="flex items-center">
                <Camera className="w-4 h-4 mr-2" />
                Add Photo
              </Button>
              <Button 
                className="bg-primary hover:bg-primary/90"
                disabled={!newPost.trim()}
              >
                Share Post
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Community Feed */}
        <section>
          <h2 className="text-xl font-semibold mb-6">Community Feed</h2>
          <div className="space-y-6">
            {posts.map((post) => (
              <Card key={post.id} className="community-post">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mr-3">
                    <span className="text-primary-foreground font-semibold">
                      {post.user.avatar}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{post.user.name}</h4>
                      <Badge variant="outline" className="text-xs">
                        {post.user.badge}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{post.time}</p>
                  </div>
                </div>

                <p className="mb-4 leading-relaxed">{post.content}</p>

                {post.image && (
                  <div className="mb-4 rounded-lg overflow-hidden">
                    <img 
                      src={post.image} 
                      alt="Post content"
                      className="w-full h-auto"
                    />
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center gap-6">
                    <button 
                      className={`flex items-center gap-2 transition-colors ${
                        post.isLiked 
                          ? "text-destructive" 
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Heart 
                        className={`w-5 h-5 ${post.isLiked ? "fill-current" : ""}`} 
                      />
                      <span className="text-sm">{post.likes}</span>
                    </button>

                    <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                      <MessageCircle className="w-5 h-5" />
                      <span className="text-sm">{post.comments}</span>
                    </button>

                    <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                      <Share2 className="w-5 h-5" />
                      <span className="text-sm">Share</span>
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Load More */}
        <div className="text-center mt-8">
          <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
            Load More Posts
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Community;