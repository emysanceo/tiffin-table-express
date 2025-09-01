import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ReviewsCarousel = () => {
  const [currentReview, setCurrentReview] = useState(0);

  const reviews = [
    {
      name: "Ayesha Rahman",
      rating: 5,
      comment: "The parathas are just like home ❤️ Amazing taste and quality!",
      avatar: "A",
      location: "Dhanmondi"
    },
    {
      name: "Karim Ahmed", 
      rating: 5,
      comment: "Best khichuri in the city! Comfort food at its finest. Highly recommended!",
      avatar: "K",
      location: "Uttara"
    },
    {
      name: "Fatima Khan",
      rating: 5,
      comment: "Fresh coffee and cozy atmosphere. Perfect spot for morning breakfast!",
      avatar: "F", 
      location: "Gulshan"
    },
    {
      name: "Rahul Gupta",
      rating: 5,
      comment: "Quick service and delicious food. The avocado toast is absolutely perfect!",
      avatar: "R",
      location: "Banani"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentReview((prev) => (prev + 1) % reviews.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [reviews.length]);

  return (
    <section className="py-8 container-padding">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-8 text-center">What Our Customers Say</h2>
        
        <div className="relative h-48 md:h-40">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentReview}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
            >
              <Card className="community-post h-full">
                <CardContent className="p-6 h-full flex flex-col justify-center">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mr-4">
                      <span className="text-primary-foreground font-semibold text-lg">
                        {reviews[currentReview].avatar}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold">{reviews[currentReview].name}</h4>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center">
                          {[...Array(reviews[currentReview].rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 text-primary fill-current" />
                          ))}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {reviews[currentReview].location}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-muted-foreground italic text-center">
                    "{reviews[currentReview].comment}"
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>
        
        {/* Indicators */}
        <div className="flex justify-center space-x-2 mt-6">
          {reviews.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentReview(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentReview ? "bg-primary w-6" : "bg-muted"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewsCarousel;