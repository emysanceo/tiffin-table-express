import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Plus } from "lucide-react";
import { motion } from "framer-motion";
import avocadoImage from "@/assets/avocado-toast.jpg";
import khichuriImage from "@/assets/khichuri-bowl.jpg";
import biryaniImage from "@/assets/biryani-special.jpg";
import heroImage from "@/assets/hero-breakfast.jpg";

const HotPicksCarousel = () => {
  const hotPicks = [
    {
      id: 1,
      name: "Avocado Toast Supreme",
      price: "₹180",
      image: avocadoImage,
      rating: 4.8,
      isPopular: true
    },
    {
      id: 2,
      name: "Comfort Khichuri Bowl",
      price: "₹140",
      image: khichuriImage,
      rating: 4.6,
      isPopular: true
    },
    {
      id: 3,
      name: "Special Biryani",
      price: "₹280",
      image: biryaniImage,
      rating: 4.9,
      isPopular: true
    },
    {
      id: 4,
      name: "Fresh Breakfast Combo",
      price: "₹220",
      image: heroImage,
      rating: 4.7,
      isPopular: false
    }
  ];

  return (
    <section className="py-8 container-padding">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Today's Hot Picks 🔥</h2>
        
        <div className="flex space-x-4 overflow-x-auto pb-4 snap-x snap-mandatory">
          {hotPicks.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex-shrink-0 w-64 snap-start"
            >
              <Card className="food-card h-full">
                <div className="aspect-square overflow-hidden relative">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                  {item.isPopular && (
                    <div className="absolute top-2 left-2 bg-destructive text-destructive-foreground text-xs px-2 py-1 rounded-full font-medium">
                      Popular
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-primary fill-current" />
                      <span className="text-sm font-medium">{item.rating}</span>
                    </div>
                  </div>
                  <h3 className="font-semibold mb-2 line-clamp-2">{item.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-primary">{item.price}</span>
                    <Button size="sm" className="bg-primary hover:bg-primary/90">
                      <Plus className="w-4 h-4 mr-1" />
                      Add
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HotPicksCarousel;