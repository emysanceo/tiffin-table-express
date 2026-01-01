import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Plus, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface MenuItem {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
  is_featured: boolean | null;
}

const HotPicksCarousel = () => {
  const [hotPicks, setHotPicks] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [addedItems, setAddedItems] = useState<Set<string>>(new Set());
  const { addItem } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    fetchHotPicks();
  }, []);

  const fetchHotPicks = async () => {
    const { data, error } = await supabase
      .from("menu_items")
      .select("id, name, price, image_url, is_featured")
      .eq("is_available", true)
      .eq("is_featured", true)
      .limit(6);

    if (!error && data) {
      setHotPicks(data);
    }
    setLoading(false);
  };

  const handleAddToCart = (item: MenuItem) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image_url: item.image_url,
    });
    setAddedItems(prev => new Set(prev).add(item.id));
    toast.success(`${item.name} added to cart`);
    
    setTimeout(() => {
      setAddedItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(item.id);
        return newSet;
      });
    }, 1500);
  };

  if (loading) {
    return (
      <section className="py-4 px-4">
        <div className="flex gap-3 overflow-x-auto scrollbar-hide">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="w-36 h-48 bg-muted rounded-2xl animate-pulse flex-shrink-0" />
          ))}
        </div>
      </section>
    );
  }

  if (hotPicks.length === 0) return null;

  return (
    <section className="py-4">
      <div className="px-4 mb-3 flex items-center justify-between">
        <h2 className="text-base font-semibold text-foreground">Hot Picks 🔥</h2>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-primary text-xs h-7 px-2"
          onClick={() => navigate("/menu")}
        >
          See All
        </Button>
      </div>
      
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-3 px-4 pb-2" style={{ minWidth: 'max-content' }}>
          {hotPicks.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex-shrink-0 w-36"
            >
              <Card className="overflow-hidden border-0 bg-card/80 backdrop-blur-sm rounded-2xl">
                <div className="aspect-square overflow-hidden relative">
                  {item.image_url ? (
                    <img 
                      src={item.image_url} 
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <Star className="w-8 h-8 text-muted-foreground" />
                    </div>
                  )}
                  <Badge className="absolute top-2 left-2 bg-destructive/90 text-destructive-foreground text-[10px] px-1.5 py-0.5">
                    Popular
                  </Badge>
                </div>
                <CardContent className="p-2.5">
                  <h3 className="font-medium text-xs line-clamp-1 mb-1">{item.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-primary">৳{item.price}</span>
                    <Button 
                      size="icon"
                      className="h-7 w-7 rounded-full"
                      onClick={() => handleAddToCart(item)}
                    >
                      <AnimatePresence mode="wait">
                        {addedItems.has(item.id) ? (
                          <motion.div
                            key="check"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                          >
                            <Check className="w-3.5 h-3.5" />
                          </motion.div>
                        ) : (
                          <motion.div
                            key="plus"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </motion.div>
                        )}
                      </AnimatePresence>
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
