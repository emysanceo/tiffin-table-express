import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Heart, Clock, Minus, Plus, Trash2, RotateCcw, Loader2 } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

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
}

interface Order {
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
  const navigate = useNavigate();
  
  const [favoriteItems, setFavoriteItems] = useState<FavoriteItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingFavorites, setLoadingFavorites] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);

  useEffect(() => {
    if (user) {
      fetchFavoriteItems();
      fetchOrders();
    }
  }, [user, favorites]);

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

  const fetchOrders = async () => {
    if (!user) return;

    setLoadingOrders(true);
    const { data: ordersData, error } = await supabase
      .from("orders")
      .select("id, created_at, status, total_amount")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10);

    if (!error && ordersData) {
      // Fetch order items for each order
      const ordersWithItems = await Promise.all(
        ordersData.map(async (order) => {
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
              };
            })
          );

          return { ...order, items: itemsWithNames };
        })
      );

      setOrders(ordersWithItems);
    }
    setLoadingOrders(false);
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
      fetchOrders();
    }

    setPlacingOrder(false);
  };

  const deliveryFee = totalPrice > 300 ? 0 : 30;
  const finalTotal = totalPrice + deliveryFee;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered": return "bg-green-500/20 text-green-400";
      case "preparing": return "bg-yellow-500/20 text-yellow-400";
      case "pending": return "bg-blue-500/20 text-blue-400";
      case "ready": return "bg-purple-500/20 text-purple-400";
      default: return "bg-muted text-muted-foreground";
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
        <TabsList className="grid w-full grid-cols-3 mb-4 h-10 bg-muted/50">
          <TabsTrigger value="cart" className="text-xs gap-1 data-[state=active]:bg-card">
            <ShoppingCart className="w-3.5 h-3.5" />
            Cart ({cartItems.length})
          </TabsTrigger>
          <TabsTrigger value="favorites" className="text-xs gap-1 data-[state=active]:bg-card">
            <Heart className="w-3.5 h-3.5" />
            Saved
          </TabsTrigger>
          <TabsTrigger value="history" className="text-xs gap-1 data-[state=active]:bg-card">
            <Clock className="w-3.5 h-3.5" />
            Orders
          </TabsTrigger>
        </TabsList>

        {/* Cart Tab */}
        <TabsContent value="cart" className="pb-24">
          {cartItems.length === 0 ? (
            <Card className="border-border/50">
              <CardContent className="p-8 text-center">
                <ShoppingCart className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                <h3 className="text-lg font-semibold mb-1">Your cart is empty</h3>
                <p className="text-sm text-muted-foreground">Add items from the menu</p>
                <Button className="mt-4" onClick={() => navigate("/menu")}>
                  Browse Menu
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {/* Cart Items */}
              <Card className="border-border/50">
                <CardContent className="p-3 space-y-3">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 p-2 rounded-lg bg-muted/30">
                      <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                        {item.image_url ? (
                          <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ShoppingCart className="w-5 h-5 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">{item.name}</h4>
                        <p className="text-primary font-semibold text-sm">৳{item.price}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="font-semibold w-5 text-center text-sm">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Order Summary */}
              <Card className="border-border/50">
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
                    <Separator />
                    <div className="flex justify-between text-base font-semibold">
                      <span>Total</span>
                      <span className="text-primary">৳{finalTotal}</span>
                    </div>
                  </div>
                  <Button 
                    className="w-full mt-4 btn-hero" 
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
            </div>
          )}
        </TabsContent>

        {/* Favorites Tab */}
        <TabsContent value="favorites" className="pb-24">
          {!user ? (
            <Card className="border-border/50">
              <CardContent className="p-8 text-center">
                <Heart className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                <h3 className="text-lg font-semibold mb-1">Login to see favorites</h3>
                <p className="text-sm text-muted-foreground">Save your favorite dishes</p>
                <Button className="mt-4" onClick={() => navigate("/auth")}>
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
            <Card className="border-border/50">
              <CardContent className="p-8 text-center">
                <Heart className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                <h3 className="text-lg font-semibold mb-1">No favorites yet</h3>
                <p className="text-sm text-muted-foreground">Heart items from the menu</p>
                <Button className="mt-4" onClick={() => navigate("/menu")}>
                  Browse Menu
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {favoriteItems.map((item) => (
                <Card key={item.id} className="overflow-hidden border-border/50">
                  <div className="aspect-square relative bg-muted">
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingCart className="w-8 h-8 text-muted-foreground" />
                      </div>
                    )}
                    <button
                      onClick={() => toggleFavorite(item.id)}
                      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-background/80 flex items-center justify-center"
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
                        className="h-7 px-3 text-xs"
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
              ))}
            </div>
          )}
        </TabsContent>

        {/* Order History Tab */}
        <TabsContent value="history" className="pb-24">
          {!user ? (
            <Card className="border-border/50">
              <CardContent className="p-8 text-center">
                <Clock className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                <h3 className="text-lg font-semibold mb-1">Login to see orders</h3>
                <p className="text-sm text-muted-foreground">Track your order history</p>
                <Button className="mt-4" onClick={() => navigate("/auth")}>
                  Login
                </Button>
              </CardContent>
            </Card>
          ) : loadingOrders ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-muted rounded-xl h-32 animate-pulse" />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <Card className="border-border/50">
              <CardContent className="p-8 text-center">
                <Clock className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                <h3 className="text-lg font-semibold mb-1">No orders yet</h3>
                <p className="text-sm text-muted-foreground">Your order history will appear here</p>
                <Button className="mt-4" onClick={() => navigate("/menu")}>
                  Start Ordering
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => (
                <Card key={order.id} className="border-border/50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="font-medium text-sm">#{order.id.slice(0, 8)}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge className={`${getStatusColor(order.status)} text-xs`}>
                          {order.status}
                        </Badge>
                        <p className="font-semibold text-sm mt-1">৳{order.total_amount}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-1 text-xs text-muted-foreground mb-3">
                      {order.items.slice(0, 2).map((item, i) => (
                        <p key={i}>{item.name} x{item.quantity}</p>
                      ))}
                      {order.items.length > 2 && (
                        <p>+{order.items.length - 2} more items</p>
                      )}
                    </div>

                    <Button variant="outline" size="sm" className="w-full text-xs">
                      <RotateCcw className="w-3 h-3 mr-1" />
                      Reorder
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Box;
