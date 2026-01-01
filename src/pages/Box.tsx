import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShoppingCart, Heart, Clock, Minus, Plus, Trash2, 
  Loader2, Star, RefreshCw, Package
} from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useAuth } from "@/contexts/AuthContext";
import { useRealtimeOrders } from "@/hooks/useRealtimeOrders";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import ReviewDialog from "@/components/ReviewDialog";

interface FavoriteItem {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
  category: string;
}

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  menu_item_id: string;
}

interface OrderWithItems {
  id: string;
  created_at: string;
  status: string;
  total_amount: number;
  items: OrderItem[];
}

const Box = () => {
  const { items: cartItems, updateQuantity, removeItem, totalPrice, clearCart, addItem } = useCart();
  const { favorites, toggleFavorite } = useFavorites();
  const { user } = useAuth();
  const { orders: realtimeOrders, loading: loadingRealtimeOrders } = useRealtimeOrders();
  const navigate = useNavigate();
  
  const [favoriteItems, setFavoriteItems] = useState<FavoriteItem[]>([]);
  const [ordersWithItems, setOrdersWithItems] = useState<OrderWithItems[]>([]);
  const [loadingFavorites, setLoadingFavorites] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [selectedReviewItem, setSelectedReviewItem] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    if (user) {
      fetchFavoriteItems();
    }
  }, [user, favorites]);

  useEffect(() => {
    if (realtimeOrders.length > 0) {
      fetchOrderItems();
    } else {
      setOrdersWithItems([]);
    }
  }, [realtimeOrders]);

  const fetchFavoriteItems = async () => {
    if (!favorites.length) {
      setFavoriteItems([]);
      return;
    }

    setLoadingFavorites(true);
    const { data, error } = await supabase
      .from("menu_items")
      .select("id, name, price, image_url, category")
      .in("id", favorites);

    if (!error && data) {
      setFavoriteItems(data);
    }
    setLoadingFavorites(false);
  };

  const fetchOrderItems = async () => {
    const ordersWithItemsData = await Promise.all(
      realtimeOrders.map(async (order) => {
        const { data: items } = await supabase
          .from("order_items")
          .select("quantity, price, menu_item_id")
          .eq("order_id", order.id);

        const itemsWithNames = await Promise.all(
          (items || []).map(async (item) => {
            const { data: menuItem } = await supabase
              .from("menu_items")
              .select("name")
              .eq("id", item.menu_item_id)
              .single();
            return {
              name: menuItem?.name || "Unknown Item",
              quantity: item.quantity,
              price: item.price,
              menu_item_id: item.menu_item_id,
            };
          })
        );

        return { ...order, items: itemsWithNames };
      })
    );

    setOrdersWithItems(ordersWithItemsData);
  };

  const handlePlaceOrder = async () => {
    if (!user) {
      toast.error("Please login to place an order");
      navigate("/auth");
      return;
    }

    if (cartItems.length === 0) return;

    setPlacingOrder(true);

    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, phone")
      .eq("id", user.id)
      .single();

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,
        customer_name: profile?.full_name || user.email || "Customer",
        customer_phone: profile?.phone || "",
        total_amount: totalPrice + (totalPrice > 300 ? 0 : 30),
        status: "pending",
      })
      .select()
      .single();

    if (orderError || !order) {
      toast.error("Failed to place order");
      setPlacingOrder(false);
      return;
    }

    const orderItems = cartItems.map((item) => ({
      order_id: order.id,
      menu_item_id: item.id,
      quantity: item.quantity,
      price: item.price,
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) {
      toast.error("Failed to add order items");
    } else {
      toast.success("Order placed successfully!");
      clearCart();
    }

    setPlacingOrder(false);
  };

  const handleReviewClick = (menuItemId: string, menuItemName: string) => {
    setSelectedReviewItem({ id: menuItemId, name: menuItemName });
    setReviewDialogOpen(true);
  };

  const deliveryFee = totalPrice > 300 ? 0 : 30;
  const finalTotal = totalPrice + deliveryFee;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "preparing": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "pending": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "ready": return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "cancelled": return "bg-destructive/20 text-destructive border-destructive/30";
      default: return "bg-muted text-muted-foreground border-border";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered": return "✓";
      case "preparing": return "👨‍🍳";
      case "pending": return "⏳";
      case "ready": return "🎉";
      case "cancelled": return "✕";
      default: return "•";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="px-4 py-4">
        <h1 className="text-2xl font-bold text-foreground">My Box</h1>
        <p className="text-sm text-muted-foreground">Orders, favorites & cart</p>
      </div>

      <Tabs defaultValue="cart" className="w-full px-4">
        <TabsList className="grid w-full grid-cols-3 mb-4 h-11 bg-muted/50 p-1 rounded-xl">
          <TabsTrigger value="cart" className="text-xs gap-1.5 data-[state=active]:bg-card rounded-lg">
            <ShoppingCart className="w-4 h-4" />
            Cart ({cartItems.length})
          </TabsTrigger>
          <TabsTrigger value="favorites" className="text-xs gap-1.5 data-[state=active]:bg-card rounded-lg">
            <Heart className="w-4 h-4" />
            Saved
          </TabsTrigger>
          <TabsTrigger value="history" className="text-xs gap-1.5 data-[state=active]:bg-card rounded-lg">
            <Clock className="w-4 h-4" />
            Orders
          </TabsTrigger>
        </TabsList>

        {/* Cart Tab */}
        <TabsContent value="cart" className="pb-24">
          <AnimatePresence mode="wait">
            {cartItems.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Card className="border-border/50 bg-card/50">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center mb-4">
                      <ShoppingCart className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold mb-1">Your cart is empty</h3>
                    <p className="text-sm text-muted-foreground mb-4">Add items from the menu</p>
                    <Button onClick={() => navigate("/menu")}>
                      Browse Menu
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <motion.div 
                className="space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {/* Cart Items */}
                <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
                  <CardContent className="p-3 space-y-2">
                    {cartItems.map((item) => (
                      <motion.div 
                        key={item.id} 
                        layout
                        className="flex items-center gap-3 p-2.5 rounded-xl bg-muted/30 border border-border/30"
                      >
                        <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-muted">
                          {item.image_url ? (
                            <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="w-5 h-5 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">{item.name}</h4>
                          <p className="text-primary font-semibold text-sm">৳{item.price * item.quantity}</p>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7 rounded-lg"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="font-semibold w-6 text-center text-sm">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7 rounded-lg"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-destructive ml-1"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>

                {/* Order Summary */}
                <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-3">Order Summary</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>৳{totalPrice}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Delivery</span>
                        <span className={deliveryFee === 0 ? "text-green-400" : ""}>
                          {deliveryFee === 0 ? "FREE" : `৳${deliveryFee}`}
                        </span>
                      </div>
                      {deliveryFee === 0 && (
                        <p className="text-xs text-green-400">Free delivery on orders above ৳300!</p>
                      )}
                      <Separator className="my-2" />
                      <div className="flex justify-between text-base font-semibold">
                        <span>Total</span>
                        <span className="text-primary">৳{finalTotal}</span>
                      </div>
                    </div>
                    <Button 
                      className="w-full mt-4 h-12 text-base font-semibold rounded-xl" 
                      onClick={handlePlaceOrder}
                      disabled={placingOrder}
                    >
                      {placingOrder ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Placing Order...
                        </>
                      ) : (
                        "Place Order"
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </TabsContent>

        {/* Favorites Tab */}
        <TabsContent value="favorites" className="pb-24">
          {!user ? (
            <Card className="border-border/50 bg-card/50">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center mb-4">
                  <Heart className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-1">Login to see favorites</h3>
                <p className="text-sm text-muted-foreground mb-4">Save your favorite dishes</p>
                <Button onClick={() => navigate("/auth")}>
                  Login
                </Button>
              </CardContent>
            </Card>
          ) : loadingFavorites ? (
            <div className="grid grid-cols-2 gap-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-muted rounded-2xl h-48 animate-pulse" />
              ))}
            </div>
          ) : favoriteItems.length === 0 ? (
            <Card className="border-border/50 bg-card/50">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center mb-4">
                  <Heart className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-1">No favorites yet</h3>
                <p className="text-sm text-muted-foreground mb-4">Heart items from the menu</p>
                <Button onClick={() => navigate("/menu")}>
                  Browse Menu
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {favoriteItems.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <Card className="overflow-hidden border-border/50 bg-card/80 backdrop-blur-sm">
                    <div className="aspect-square relative bg-muted">
                      {item.image_url ? (
                        <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-8 h-8 text-muted-foreground" />
                        </div>
                      )}
                      <button
                        onClick={() => toggleFavorite(item.id)}
                        className="absolute top-2 right-2 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center"
                      >
                        <Heart className="w-4 h-4 fill-destructive text-destructive" />
                      </button>
                    </div>
                    <CardContent className="p-3">
                      <h3 className="font-semibold text-sm truncate">{item.name}</h3>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-primary font-bold">৳{item.price}</span>
                        <Button 
                          size="sm" 
                          className="h-7 px-3 text-xs rounded-lg"
                          onClick={() => {
                            addItem({ id: item.id, name: item.name, price: item.price, image_url: item.image_url });
                            toast.success("Added to cart");
                          }}
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          Add
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Order History Tab */}
        <TabsContent value="history" className="pb-24">
          {!user ? (
            <Card className="border-border/50 bg-card/50">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center mb-4">
                  <Clock className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-1">Login to see orders</h3>
                <p className="text-sm text-muted-foreground mb-4">Track your order history</p>
                <Button onClick={() => navigate("/auth")}>
                  Login
                </Button>
              </CardContent>
            </Card>
          ) : loadingRealtimeOrders ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-muted rounded-xl h-32 animate-pulse" />
              ))}
            </div>
          ) : ordersWithItems.length === 0 ? (
            <Card className="border-border/50 bg-card/50">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center mb-4">
                  <Clock className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-1">No orders yet</h3>
                <p className="text-sm text-muted-foreground mb-4">Your order history will appear here</p>
                <Button onClick={() => navigate("/menu")}>
                  Start Ordering
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {/* Realtime indicator */}
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground py-2">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="w-2 h-2 bg-green-500 rounded-full"
                />
                Live updates enabled
              </div>

              <AnimatePresence mode="popLayout">
                {ordersWithItems.map((order) => (
                  <motion.div
                    key={order.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <Card className="border-border/50 bg-card/80 backdrop-blur-sm overflow-hidden">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="font-medium text-sm">#{order.id.slice(0, 8)}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(order.created_at).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                          <div className="text-right">
                            <Badge className={`${getStatusColor(order.status)} text-xs border`}>
                              <span className="mr-1">{getStatusIcon(order.status)}</span>
                              {order.status}
                            </Badge>
                            <p className="font-semibold text-sm mt-1 text-primary">৳{order.total_amount}</p>
                          </div>
                        </div>
                        
                        <div className="space-y-1.5 text-xs mb-3">
                          {order.items.slice(0, 2).map((item, i) => (
                            <div key={i} className="flex items-center justify-between text-muted-foreground">
                              <span>{item.name} x{item.quantity}</span>
                              {order.status === "delivered" && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 px-2 text-xs text-primary"
                                  onClick={() => handleReviewClick(item.menu_item_id, item.name)}
                                >
                                  <Star className="w-3 h-3 mr-1" />
                                  Rate
                                </Button>
                              )}
                            </div>
                          ))}
                          {order.items.length > 2 && (
                            <p className="text-muted-foreground/60">+{order.items.length - 2} more items</p>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1 h-8 text-xs rounded-lg"
                            onClick={() => {
                              order.items.forEach(item => {
                                const menuItem = favoriteItems.find(f => f.id === item.menu_item_id);
                                if (menuItem) {
                                  addItem({ 
                                    id: menuItem.id, 
                                    name: menuItem.name, 
                                    price: menuItem.price, 
                                    image_url: menuItem.image_url 
                                  });
                                }
                              });
                              toast.success("Items added to cart");
                            }}
                          >
                            <RefreshCw className="w-3 h-3 mr-1" />
                            Reorder
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Review Dialog */}
      {selectedReviewItem && (
        <ReviewDialog
          open={reviewDialogOpen}
          onOpenChange={setReviewDialogOpen}
          menuItemId={selectedReviewItem.id}
          menuItemName={selectedReviewItem.name}
        />
      )}
    </div>
  );
};

export default Box;
