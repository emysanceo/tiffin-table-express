import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import { motion } from "framer-motion";
import biryaniImage from "@/assets/biryani-special.jpg";
import khichuriImage from "@/assets/khichuri-bowl.jpg";

const PromotionsCarousel = () => {
  const promotions = [
    {
      name: "Special Biryani",
      image: biryaniImage,
      days: "Tuesday & Friday",
      nextAvailable: "12 hrs",
      discount: "Special Price"
    },
    {
      name: "Comfort Khichuri",
      image: khichuriImage,
      days: "Wednesday & Saturday",
      nextAvailable: "2 days",
      discount: "20% Off"
    },
    {
      name: "Fried Rice Special",
      image: biryaniImage,
      days: "Monday & Thursday",
      nextAvailable: "18 hrs",
      discount: "Buy 1 Get 1"
    }
  ];

  return (
    <section className="py-8 container-padding">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Weekly Specials</h2>
          <Badge className="bg-destructive text-destructive-foreground">
            Limited Time
          </Badge>
        </div>
        
        <div className="flex space-x-4 overflow-x-auto pb-4 snap-x snap-mandatory">
          {promotions.map((promo, index) => (
            <motion.div
              key={promo.name}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex-shrink-0 w-72 snap-start"
            >
              <Card className="food-card h-full">
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={promo.image} 
                    alt={promo.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Badge className="bg-accent text-accent-foreground">
                      {promo.discount}
                    </Badge>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="w-3 h-3 mr-1" />
                      {promo.nextAvailable}
                    </div>
                  </div>
                  <h3 className="font-semibold mb-1">{promo.name}</h3>
                  <p className="text-sm text-muted-foreground">{promo.days}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PromotionsCarousel;