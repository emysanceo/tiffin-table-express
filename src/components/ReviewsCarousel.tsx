import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  user_id: string;
  created_at: string;
}

const ReviewsCarousel = () => {
  const [currentReview, setCurrentReview] = useState(0);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  // Fallback static reviews if no DB reviews exist
  const staticReviews = [
    {
      id: "1",
      name: "Ayesha R.",
      rating: 5,
      comment: "The parathas are just like home ❤️ Amazing taste and quality!",
      avatar: "A",
    },
    {
      id: "2",
      name: "Karim A.", 
      rating: 5,
      comment: "Best khichuri in the city! Comfort food at its finest.",
      avatar: "K",
    },
    {
      id: "3",
      name: "Fatima K.",
      rating: 5,
      comment: "Fresh coffee and cozy vibes. Perfect morning spot!",
      avatar: "F", 
    },
  ];

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    const { data, error } = await supabase
      .from("reviews")
      .select("id, rating, comment, user_id, created_at")
      .gte("rating", 4)
      .not("comment", "is", null)
      .order("created_at", { ascending: false })
      .limit(5);

    if (!error && data && data.length > 0) {
      setReviews(data);
    }
    setLoading(false);
  };

  const displayReviews = reviews.length > 0 
    ? reviews.map(r => ({
        id: r.id,
        name: "Happy Customer",
        rating: r.rating,
        comment: r.comment || "",
        avatar: "C",
      }))
    : staticReviews;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentReview((prev) => (prev + 1) % displayReviews.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [displayReviews.length]);

  if (loading) {
    return (
      <section className="py-6 px-4">
        <div className="h-28 bg-muted rounded-2xl animate-pulse" />
      </section>
    );
  }

  return (
    <section className="py-6 px-4">
      <h2 className="text-base font-semibold mb-4 text-center">What Customers Say</h2>
      
      <div className="relative h-28">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentReview}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          >
            <Card className="h-full border-border/50 bg-card/80 backdrop-blur-sm">
              <CardContent className="p-4 h-full flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-primary-foreground font-semibold">
                    {displayReviews[currentReview].avatar}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{displayReviews[currentReview].name}</span>
                    <div className="flex items-center">
                      {[...Array(displayReviews[currentReview].rating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    "{displayReviews[currentReview].comment}"
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* Indicators */}
      <div className="flex justify-center gap-1.5 mt-3">
        {displayReviews.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentReview(index)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              index === currentReview ? "bg-primary w-4" : "bg-muted w-1.5"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default ReviewsCarousel;
