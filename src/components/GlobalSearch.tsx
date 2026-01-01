import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, UtensilsCrossed, ShoppingBag, Heart, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useCart } from "@/contexts/CartContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface SearchResult {
  id: string;
  type: "menu" | "order" | "favorite";
  title: string;
  subtitle: string;
  image?: string | null;
  price?: number;
  status?: string;
}

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

const GlobalSearch = ({ isOpen, onClose }: GlobalSearchProps) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState<"all" | "menu" | "orders" | "favorites">("all");
  const inputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const { favorites } = useFavorites();
  const { addItem } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (query.trim().length >= 2) {
        performSearch();
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(debounce);
  }, [query, activeFilter]);

  const performSearch = async () => {
    setLoading(true);
    const searchResults: SearchResult[] = [];

    // Search menu items
    if (activeFilter === "all" || activeFilter === "menu") {
      const { data: menuItems } = await supabase
        .from("menu_items")
        .select("id, name, description, price, image_url, category")
        .or(`name.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%`)
        .eq("is_available", true)
        .limit(5);

      if (menuItems) {
        searchResults.push(
          ...menuItems.map((item) => ({
            id: item.id,
            type: "menu" as const,
            title: item.name,
            subtitle: item.category,
            image: item.image_url,
            price: item.price,
          }))
        );
      }
    }

    // Search orders (only for logged in users)
    if (user && (activeFilter === "all" || activeFilter === "orders")) {
      const { data: orders } = await supabase
        .from("orders")
        .select("id, status, total_amount, created_at")
        .eq("user_id", user.id)
        .or(`status.ilike.%${query}%`)
        .order("created_at", { ascending: false })
        .limit(3);

      if (orders) {
        searchResults.push(
          ...orders.map((order) => ({
            id: order.id,
            type: "order" as const,
            title: `Order #${order.id.slice(0, 8)}`,
            subtitle: new Date(order.created_at).toLocaleDateString(),
            price: order.total_amount,
            status: order.status,
          }))
        );
      }
    }

    // Search favorites
    if (user && favorites.length > 0 && (activeFilter === "all" || activeFilter === "favorites")) {
      const { data: favoriteItems } = await supabase
        .from("menu_items")
        .select("id, name, price, image_url, category")
        .in("id", favorites)
        .or(`name.ilike.%${query}%,category.ilike.%${query}%`)
        .limit(3);

      if (favoriteItems) {
        searchResults.push(
          ...favoriteItems.map((item) => ({
            id: item.id,
            type: "favorite" as const,
            title: item.name,
            subtitle: "Favorite",
            image: item.image_url,
            price: item.price,
          }))
        );
      }
    }

    setResults(searchResults);
    setLoading(false);
  };

  const handleResultClick = (result: SearchResult) => {
    if (result.type === "menu" || result.type === "favorite") {
      addItem({
        id: result.id,
        name: result.title,
        price: result.price!,
        image_url: result.image,
      });
      toast.success(`${result.title} added to cart`);
    } else if (result.type === "order") {
      navigate("/box");
      onClose();
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "menu":
        return <UtensilsCrossed className="w-4 h-4" />;
      case "order":
        return <ShoppingBag className="w-4 h-4" />;
      case "favorite":
        return <Heart className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-500/20 text-green-400";
      case "preparing":
        return "bg-yellow-500/20 text-yellow-400";
      case "pending":
        return "bg-blue-500/20 text-blue-400";
      case "ready":
        return "bg-purple-500/20 text-purple-400";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm"
    >
      <div className="container max-w-lg mx-auto px-4 pt-safe-top">
        {/* Search Header */}
        <div className="flex items-center gap-3 py-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              ref={inputRef}
              type="text"
              placeholder="Search menu, orders, favorites..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 pr-10 h-12 bg-muted border-0 rounded-xl text-base"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            )}
          </div>
          <Button variant="ghost" onClick={onClose} className="px-3">
            Cancel
          </Button>
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2 pb-4 overflow-x-auto scrollbar-hide">
          {(["all", "menu", "orders", "favorites"] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeFilter === filter
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>

        {/* Results */}
        <div className="space-y-2 pb-24 overflow-y-auto max-h-[calc(100vh-200px)]">
          {loading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          )}

          {!loading && query.length >= 2 && results.length === 0 && (
            <div className="text-center py-12">
              <Search className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground">No results found</p>
              <p className="text-sm text-muted-foreground/60">Try different keywords</p>
            </div>
          )}

          <AnimatePresence mode="popLayout">
            {results.map((result, index) => (
              <motion.button
                key={`${result.type}-${result.id}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleResultClick(result)}
                className="w-full flex items-center gap-3 p-3 bg-card rounded-xl border border-border/50 hover:border-primary/30 transition-colors text-left"
              >
                {result.image ? (
                  <img
                    src={result.image}
                    alt={result.title}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                    {getTypeIcon(result.type)}
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{result.title}</p>
                  <p className="text-xs text-muted-foreground">{result.subtitle}</p>
                </div>

                <div className="flex flex-col items-end gap-1">
                  {result.price && (
                    <span className="text-sm font-semibold text-primary">
                      ৳{result.price}
                    </span>
                  )}
                  {result.status && (
                    <Badge className={`text-[10px] ${getStatusColor(result.status)}`}>
                      {result.status}
                    </Badge>
                  )}
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default GlobalSearch;
