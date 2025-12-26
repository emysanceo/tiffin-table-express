import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";

interface Review {
  id: string;
  user_id: string;
  menu_item_id: string | null;
  rating: number;
  comment: string | null;
  created_at: string;
  profiles?: {
    full_name: string | null;
    avatar_url: string | null;
  };
  menu_items?: {
    name: string;
  };
}

const AdminReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    const { data: reviewsData, error: reviewsError } = await supabase
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false });

    if (reviewsError) {
      toast.error("Failed to load reviews");
      setLoading(false);
      return;
    }

    // Fetch profiles and menu items separately
    const userIds = [...new Set(reviewsData?.map(r => r.user_id) || [])];
    const menuItemIds = [...new Set(reviewsData?.filter(r => r.menu_item_id).map(r => r.menu_item_id) || [])];

    const [profilesRes, menuItemsRes] = await Promise.all([
      supabase.from("profiles").select("id, full_name, avatar_url").in("id", userIds),
      menuItemIds.length > 0 
        ? supabase.from("menu_items").select("id, name").in("id", menuItemIds)
        : { data: [] }
    ]);

    const profilesMap = new Map<string, { full_name: string | null; avatar_url: string | null }>();
    profilesRes.data?.forEach(p => profilesMap.set(p.id, { full_name: p.full_name, avatar_url: p.avatar_url }));

    const menuItemsMap = new Map<string, { name: string }>();
    (menuItemsRes.data as { id: string; name: string }[] || []).forEach(m => menuItemsMap.set(m.id, { name: m.name }));

    const reviewsWithData: Review[] = (reviewsData || []).map(review => ({
      ...review,
      profiles: profilesMap.get(review.user_id) || { full_name: null, avatar_url: null },
      menu_items: review.menu_item_id ? menuItemsMap.get(review.menu_item_id) : undefined
    }));

    setReviews(reviewsWithData);
    setLoading(false);
  };

  const deleteReview = async (reviewId: string) => {
    const { error } = await supabase.from("reviews").delete().eq("id", reviewId);

    if (error) {
      toast.error("Failed to delete review");
    } else {
      toast.success("Review deleted");
      fetchReviews();
    }
  };

  const averageRating = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : "0";

  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: reviews.filter((r) => r.rating === rating).length,
    percentage: reviews.length > 0
      ? (reviews.filter((r) => r.rating === rating).length / reviews.length) * 100
      : 0,
  }));

  return (
    <div className="space-y-4">
      {/* Stats */}
      <Card className="bg-card border-border/50">
        <CardContent className="p-4">
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-4xl font-bold text-foreground">{averageRating}</p>
              <div className="flex items-center gap-0.5 justify-center mt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${
                      star <= Math.round(parseFloat(averageRating))
                        ? "fill-primary text-primary"
                        : "text-muted-foreground"
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-1">{reviews.length} reviews</p>
            </div>
            <div className="flex-1 space-y-1">
              {ratingDistribution.map(({ rating, count, percentage }) => (
                <div key={rating} className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground w-3">{rating}</span>
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground w-6">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reviews List */}
      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-8 text-muted-foreground">Loading reviews...</div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No reviews yet</div>
        ) : (
          reviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
            >
              <Card className="bg-card border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={review.profiles?.avatar_url || ""} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {review.profiles?.full_name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-foreground">
                            {review.profiles?.full_name || "Anonymous"}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <div className="flex items-center gap-0.5">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`w-3 h-3 ${
                                    star <= review.rating
                                      ? "fill-primary text-primary"
                                      : "text-muted-foreground"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {format(new Date(review.created_at), "MMM d, yyyy")}
                            </span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteReview(review.id)}
                          className="h-8 w-8 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      {review.menu_items?.name && (
                        <p className="text-xs text-primary mt-1">
                          For: {review.menu_items.name}
                        </p>
                      )}
                      {review.comment && (
                        <p className="mt-2 text-foreground text-sm">{review.comment}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminReviews;
