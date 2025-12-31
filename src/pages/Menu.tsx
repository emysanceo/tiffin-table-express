import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Coffee, UtensilsCrossed, Cookie, Sparkles, Check, Heart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useCart } from "@/contexts/CartContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useAuth } from "@/contexts/AuthContext";

interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  image_url: string | null;
  is_available: boolean | null;
  is_featured: boolean | null;
  stock: number | null;
}

const Menu = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [addedItems, setAddedItems] = useState<Set<string>>(new Set());
  const { addItem } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { user } = useAuth();

  const categories = [
    { value: "all", label: "All", icon: Sparkles },
    { value: "Breakfast", label: "Breakfast", icon: UtensilsCrossed },
    { value: "Snacks", label: "Snacks", icon: Cookie },
    { value: "Café", label: "Café", icon: Coffee },
  ];

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    const { data, error } = await supabase
      .from("menu_items")
      .select("*")
      .eq("is_available", true)
      .order("category", { ascending: true });

    if (error) {
      toast.error("Failed to load menu");
    } else {
      setMenuItems(data || []);
    }
    setLoading(false);
  };

  const filteredItems = menuItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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

  const getCategoryCount = (category: string) => {
    if (category === "all") return menuItems.length;
    return menuItems.filter(item => item.category === category).length;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border/50">
        <div className="px-4 py-3">
          {/* Search Bar */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              type="text"
              placeholder="Search dishes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-muted/50 border-0 h-10 rounded-xl text-sm"
            />
          </div>

          {/* Category Pills */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 -mx-4 px-4">
            {categories.map((category) => {
              const Icon = category.icon;
              const isActive = selectedCategory === category.value;
              return (
                <motion.button
                  key={category.value}
                  onClick={() => setSelectedCategory(category.value)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {category.label}
                  <span className={`text-xs ${isActive ? "text-primary-foreground/80" : "text-muted-foreground/60"}`}>
                    ({getCategoryCount(category.value)})
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Menu Grid */}
      <div className="px-4 py-4 pb-24">
        {loading ? (
          <div className="grid grid-cols-2 gap-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-muted rounded-2xl h-52 animate-pulse" />
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground">No items found</p>
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-2 gap-3"
            layout
          >
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.03 }}
                >
                  <Card className="overflow-hidden border-0 bg-card shadow-sm hover:shadow-md transition-shadow rounded-2xl">
                    {/* Image */}
                    <div className="aspect-square relative overflow-hidden bg-muted">
                      {item.image_url ? (
                        <img 
                          src={item.image_url} 
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                          <UtensilsCrossed className="w-8 h-8 text-primary/30" />
                        </div>
                      )}
                      
                      {/* Favorite Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(item.id);
                        }}
                        className="absolute top-2 right-2 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center transition-all"
                      >
                        <Heart 
                          className={`w-4 h-4 transition-colors ${
                            isFavorite(item.id) 
                              ? "fill-destructive text-destructive" 
                              : "text-foreground"
                          }`} 
                        />
                      </button>
                      
                      {/* Featured Badge */}
                      {item.is_featured && (
                        <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground text-[10px] px-1.5 py-0.5">
                          ⭐ Popular
                        </Badge>
                      )}

                      {/* Out of Stock */}
                      {item.stock !== null && item.stock <= 0 && (
                        <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                          <span className="text-sm font-medium text-destructive">Out of Stock</span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <CardContent className="p-3">
                      <h3 className="font-semibold text-sm line-clamp-1 text-foreground">
                        {item.name}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                        {item.description || item.category}
                      </p>
                      
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-base font-bold text-primary">
                          ৳{item.price}
                        </span>
                        <Button 
                          size="sm" 
                          className="h-7 w-7 p-0 rounded-full bg-primary hover:bg-primary/90"
                          disabled={item.stock !== null && item.stock <= 0}
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
                                <Check className="w-4 h-4" />
                              </motion.div>
                            ) : (
                              <motion.div
                                key="plus"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0 }}
                              >
                                <Plus className="w-4 h-4" />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Menu;
