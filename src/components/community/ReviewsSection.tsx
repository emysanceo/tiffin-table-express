import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, ThumbsUp, ThumbsDown, Filter, Camera, Award } from "lucide-react";
import { motion } from "framer-motion";

const ReviewsSection = () => {
  const [newReview, setNewReview] = useState("");
  const [rating, setRating] = useState(0);
  const [filterBy, setFilterBy] = useState("all");
  const [sortBy, setSortBy] = useState("recent");

  const reviews = [
    {
      id: 1,
      user: {
        name: "Priya Sharma",
        avatar: "/placeholder.svg",
        badge: "Verified Customer",
        totalReviews: 23,
        isTopReviewer: true
      },
      rating: 5,
      title: "Absolutely Perfect Breakfast Experience!",
      content: "I've been coming to Tiffin Table for months now, and they never disappoint. The avocado toast is consistently perfect - fresh bread, perfectly ripe avocado, and the poached egg is always spot on. The staff is friendly and the atmosphere is cozy. Highly recommend for anyone looking for quality breakfast!",
      images: ["/placeholder.svg", "/placeholder.svg"],
      item: "Avocado Toast Supreme",
      visitDate: "March 2024",
      helpful: 45,
      notHelpful: 2,
      time: "2 days ago",
      verified: true
    },
    {
      id: 2,
      user: {
        name: "Rahul Gupta",
        avatar: "/placeholder.svg",
        badge: "Food Enthusiast",
        totalReviews: 12,
        isTopReviewer: false
      },
      rating: 4,
      title: "Great comfort food, minor wait time",
      content: "The khichuri here reminds me of home! It's perfectly seasoned and very comforting. Only reason I'm giving 4 stars instead of 5 is because of the wait time during lunch rush. But the food quality makes it worth it. Will definitely be back for more comfort food cravings.",
      images: ["/placeholder.svg"],
      item: "Comfort Khichuri Bowl",
      visitDate: "March 2024",
      helpful: 28,
      notHelpful: 1,
      time: "1 week ago",
      verified: true
    },
    {
      id: 3,
      user: {
        name: "Sneha Patel",
        avatar: "/placeholder.svg",
        badge: "Regular Visitor",
        totalReviews: 8,
        isTopReviewer: false
      },
      rating: 5,
      title: "Best biryani in the area!",
      content: "Pre-ordered the special biryani for a family gathering and it was absolutely phenomenal! The rice was perfectly cooked, the meat was tender, and the spices were balanced beautifully. The pre-order system is very convenient too. Everyone in my family loved it!",
      images: [],
      item: "Special Biryani (Full)",
      visitDate: "February 2024",
      helpful: 67,
      notHelpful: 0,
      time: "2 weeks ago",
      verified: true
    },
    {
      id: 4,
      user: {
        name: "Ahmed Khan",
        avatar: "/placeholder.svg",
        badge: "Coffee Lover",
        totalReviews: 15,
        isTopReviewer: true
      },
      rating: 4,
      title: "Excellent coffee, good ambiance",
      content: "Their Nescafé Special Coffee is really well made. Rich flavor, perfect temperature, and they know how to make it just right. The seating is comfortable and it's a good place to work or catch up with friends. Sometimes gets a bit crowded during peak hours.",
      images: ["/placeholder.svg"],
      item: "Nescafé Special Coffee",
      visitDate: "March 2024",
      helpful: 34,
      notHelpful: 3,
      time: "3 days ago",
      verified: true
    }
  ];

  const menuItems = [
    "All Items",
    "Avocado Toast Supreme",
    "Comfort Khichuri Bowl", 
    "Special Biryani",
    "Nescafé Special Coffee",
    "Traditional Paratha"
  ];

  const overallRating = 4.6;
  const totalReviews = 234;
  const ratingDistribution = [
    { stars: 5, count: 156, percentage: 67 },
    { stars: 4, count: 52, percentage: 22 },
    { stars: 3, count: 18, percentage: 8 },
    { stars: 2, count: 5, percentage: 2 },
    { stars: 1, count: 3, percentage: 1 }
  ];

  const renderStars = (rating: number, interactive = false, onStarClick?: (rating: number) => void) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`w-5 h-5 ${
          index < rating 
            ? "text-primary fill-current" 
            : "text-muted-foreground"
        } ${interactive ? "cursor-pointer hover:text-primary" : ""}`}
        onClick={() => interactive && onStarClick && onStarClick(index + 1)}
      />
    ));
  };

  return (
    <div className="space-y-8">
      {/* Header with Stats */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-6 h-6 text-primary" />
              Overall Rating
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-4">
              <div className="text-4xl font-bold">{overallRating}</div>
              <div>
                <div className="flex items-center mb-1">
                  {renderStars(Math.round(overallRating))}
                </div>
                <p className="text-sm text-muted-foreground">Based on {totalReviews} reviews</p>
              </div>
            </div>
            
            {/* Rating Distribution */}
            <div className="space-y-2">
              {ratingDistribution.map((item) => (
                <div key={item.stars} className="flex items-center gap-2 text-sm">
                  <span className="w-8">{item.stars}★</span>
                  <div className="flex-1 bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full" 
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                  <span className="w-8 text-muted-foreground">{item.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Write Review */}
        <Card>
          <CardHeader>
            <CardTitle>Write a Review</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm mb-2">Rate your experience:</p>
              <div className="flex items-center gap-1">
                {renderStars(rating, true, setRating)}
              </div>
            </div>
            
            <Textarea
              placeholder="Share your experience with others..."
              value={newReview}
              onChange={(e) => setNewReview(e.target.value)}
              rows={4}
            />
            
            <div className="flex items-center justify-between">
              <Button variant="outline" size="sm">
                <Camera className="w-4 h-4 mr-2" />
                Add Photos
              </Button>
              <Button 
                className="bg-primary hover:bg-primary/90"
                disabled={!newReview.trim() || rating === 0}
              >
                Submit Review
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Sort */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex gap-4 w-full sm:w-auto">
          <Select value={filterBy} onValueChange={setFilterBy}>
            <SelectTrigger className="w-48">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter by item" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Items</SelectItem>
              {menuItems.slice(1).map((item) => (
                <SelectItem key={item} value={item.toLowerCase().replace(/\s+/g, '-')}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="helpful">Most Helpful</SelectItem>
              <SelectItem value="rating-high">Highest Rating</SelectItem>
              <SelectItem value="rating-low">Lowest Rating</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Badge variant="secondary">
          Showing {reviews.length} of {totalReviews} reviews
        </Badge>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.map((review, index) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="community-post">
              {/* Review Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={review.user.avatar} />
                      <AvatarFallback>{review.user.name[0]}</AvatarFallback>
                    </Avatar>
                    {review.user.isTopReviewer && (
                      <Award className="absolute -top-1 -right-1 w-4 h-4 text-primary" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{review.user.name}</h4>
                      {review.verified && <Badge variant="outline" className="text-xs">Verified</Badge>}
                      {review.user.isTopReviewer && (
                        <Badge className="bg-primary text-primary-foreground text-xs">Top Reviewer</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{review.user.totalReviews} reviews</span>
                      <span>•</span>
                      <span>{review.time}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Rating and Title */}
              <div className="mb-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center">
                    {renderStars(review.rating)}
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {review.item}
                  </Badge>
                  <span className="text-sm text-muted-foreground">Visited {review.visitDate}</span>
                </div>
                <h3 className="font-semibold text-lg">{review.title}</h3>
              </div>

              {/* Review Content */}
              <p className="text-muted-foreground mb-4 leading-relaxed">{review.content}</p>

              {/* Review Images */}
              {review.images.length > 0 && (
                <div className="flex gap-2 mb-4">
                  {review.images.map((image, idx) => (
                    <div key={idx} className="w-20 h-20 rounded-lg overflow-hidden">
                      <img 
                        src={image} 
                        alt={`Review image ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Review Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                    <ThumbsUp className="w-4 h-4" />
                    <span className="text-sm">Helpful ({review.helpful})</span>
                  </button>
                  <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                    <ThumbsDown className="w-4 h-4" />
                    <span className="text-sm">Not Helpful ({review.notHelpful})</span>
                  </button>
                </div>
                <Button variant="ghost" size="sm">
                  Reply
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center">
        <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
          Load More Reviews
        </Button>
      </div>
    </div>
  );
};

export default ReviewsSection;