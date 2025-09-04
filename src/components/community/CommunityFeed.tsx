import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Camera, 
  MoreHorizontal,
  Bookmark,
  Send
} from "lucide-react";
import { motion } from "framer-motion";

const CommunityFeed = () => {
  const [newPost, setNewPost] = useState("");
  const [showComments, setShowComments] = useState<number | null>(null);
  const [newComment, setNewComment] = useState("");

  const posts = [
    {
      id: 1,
      user: {
        name: "Priya Sharma",
        avatar: "/placeholder.svg",
        badge: "Food Lover",
        verified: true
      },
      content: "Just had the most amazing avocado toast at Tiffin Table! The poached egg was perfectly runny 🍳✨ This is definitely going to be my regular breakfast spot. The ambiance is so cozy too!",
      image: null,
      likes: 24,
      comments: [
        { user: "Rahul", comment: "I agree! Their breakfast is amazing", time: "1h" },
        { user: "Sneha", comment: "Need to try this soon!", time: "30m" }
      ],
      shares: 3,
      time: "2 hours ago",
      isLiked: false,
      isBookmarked: false,
      location: "Tiffin Table, Dhanmondi"
    },
    {
      id: 2,
      user: {
        name: "Rahul Gupta",
        avatar: "/placeholder.svg",
        badge: "Regular Customer",
        verified: false
      },
      content: "Nothing beats their khichuri on a rainy day. Comfort food at its finest! Who else is a fan? 🌧️ #ComfortFood #RainyDay",
      image: "/placeholder.svg",
      likes: 31,
      comments: [
        { user: "Priya", comment: "YES! Perfect rainy day food", time: "2h" },
        { user: "Ahmed", comment: "Their khichuri is legendary", time: "1h" }
      ],
      shares: 8,
      time: "5 hours ago",
      isLiked: true,
      isBookmarked: true,
      location: "Tiffin Table, Uttara"
    },
    {
      id: 3,
      user: {
        name: "Sneha Patel",
        avatar: "/placeholder.svg",
        badge: "Community Star",
        verified: true
      },
      content: "Pre-ordered the special biryani for my family dinner this weekend. Can't wait! 🍛 The booking system is so convenient. Highly recommend planning ahead for their specials!",
      image: null,
      likes: 18,
      comments: [
        { user: "Fatima", comment: "Smart! I should pre-order too", time: "4h" }
      ],
      shares: 2,
      time: "1 day ago",
      isLiked: false,
      isBookmarked: false,
      location: "Tiffin Table, Gulshan"
    }
  ];

  const handlePostSubmit = () => {
    if (newPost.trim()) {
      // Handle post submission
      setNewPost("");
    }
  };

  const toggleComments = (postId: number) => {
    setShowComments(showComments === postId ? null : postId);
  };

  return (
    <div className="space-y-6">
      {/* Create Post */}
      <Card className="card-hover">
        <CardContent className="p-6">
          <div className="flex gap-4">
            <Avatar>
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback>YU</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Textarea
                placeholder="What's on your mind? Share your Tiffin Table experience..."
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                className="bg-input border-border mb-4 resize-none"
                rows={3}
              />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" className="flex items-center gap-2">
                    <Camera className="w-4 h-4" />
                    Photo
                  </Button>
                  <Button variant="ghost" size="sm">
                    📍 Location
                  </Button>
                  <Button variant="ghost" size="sm">
                    😊 Feeling
                  </Button>
                </div>
                <Button 
                  className="bg-primary hover:bg-primary/90"
                  disabled={!newPost.trim()}
                  onClick={handlePostSubmit}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Posts Feed */}
      <div className="space-y-6">
        {posts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="community-post">
              {/* Post Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={post.user.avatar} />
                    <AvatarFallback>{post.user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{post.user.name}</h4>
                      {post.user.verified && <span className="text-primary">✓</span>}
                      <Badge variant="outline" className="text-xs">
                        {post.user.badge}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{post.time}</span>
                      <span>•</span>
                      <span>{post.location}</span>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>

              {/* Post Content */}
              <p className="mb-4 leading-relaxed">{post.content}</p>

              {/* Post Image */}
              {post.image && (
                <div className="mb-4 rounded-lg overflow-hidden">
                  <img 
                    src={post.image} 
                    alt="Post content"
                    className="w-full h-auto max-h-96 object-cover"
                  />
                </div>
              )}

              {/* Engagement Stats */}
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-4">
                  <span>❤️ {post.likes} likes</span>
                  <span>{post.comments.length} comments</span>
                  <span>{post.shares} shares</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="flex items-center gap-6">
                  <button 
                    className={`flex items-center gap-2 transition-colors hover:bg-muted rounded-md px-3 py-2 ${
                      post.isLiked 
                        ? "text-destructive" 
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Heart 
                      className={`w-5 h-5 ${post.isLiked ? "fill-current" : ""}`} 
                    />
                    <span className="text-sm">Like</span>
                  </button>

                  <button 
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md px-3 py-2 transition-colors"
                    onClick={() => toggleComments(post.id)}
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span className="text-sm">Comment</span>
                  </button>

                  <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md px-3 py-2 transition-colors">
                    <Share2 className="w-5 h-5" />
                    <span className="text-sm">Share</span>
                  </button>
                </div>

                <button 
                  className={`p-2 rounded-md transition-colors ${
                    post.isBookmarked 
                      ? "text-primary" 
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Bookmark className={`w-5 h-5 ${post.isBookmarked ? "fill-current" : ""}`} />
                </button>
              </div>

              {/* Comments Section */}
              {showComments === post.id && (
                <div className="mt-4 pt-4 border-t border-border space-y-4">
                  {/* Existing Comments */}
                  {post.comments.map((comment, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="text-xs">{comment.user[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="bg-muted rounded-lg px-3 py-2">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm">{comment.user}</span>
                            <span className="text-xs text-muted-foreground">{comment.time}</span>
                          </div>
                          <p className="text-sm">{comment.comment}</p>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Add Comment */}
                  <div className="flex items-center gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback>YU</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Textarea
                          placeholder="Write a comment..."
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          className="flex-1 min-h-[40px] resize-none"
                          rows={1}
                        />
                        <Button size="sm" disabled={!newComment.trim()}>
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center">
        <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
          Load More Posts
        </Button>
      </div>
    </div>
  );
};

export default CommunityFeed;
