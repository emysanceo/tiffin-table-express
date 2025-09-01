import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Heart, Clock, Minus, Plus, Trash2, RotateCcw } from "lucide-react";
import avocadoToastImage from "@/assets/avocado-toast.jpg";
import khichuriImage from "@/assets/khichuri-bowl.jpg";
import biryaniImage from "@/assets/biryani-special.jpg";

const Box = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Avocado Toast Supreme",
      price: 180,
      quantity: 2,
      image: avocadoToastImage,
      category: "Breakfast",
    },
    {
      id: 2,
      name: "Comfort Khichuri Bowl",
      price: 140,
      quantity: 1,
      image: khichuriImage,
      category: "Snacks",
    },
  ]);

  const favoriteItems = [
    {
      id: 3,
      name: "Special Biryani",
      price: 280,
      image: biryaniImage,
      category: "Pre-order",
      isPreOrder: true,
    },
    {
      id: 1,
      name: "Avocado Toast Supreme",
      price: 180,
      image: avocadoToastImage,
      category: "Breakfast",
    },
  ];

  const orderHistory = [
    {
      id: 1,
      orderNumber: "#TT001234",
      date: "2024-01-20",
      status: "Delivered",
      total: 500,
      items: [
        { name: "Avocado Toast Supreme", quantity: 2, price: 180 },
        { name: "Coffee", quantity: 1, price: 140 },
      ],
    },
    {
      id: 2,
      orderNumber: "#TT001235",
      date: "2024-01-18",
      status: "Delivered",
      total: 420,
      items: [
        { name: "Comfort Khichuri Bowl", quantity: 2, price: 140 },
        { name: "Lassi", quantity: 1, price: 140 },
      ],
    },
    {
      id: 3,
      orderNumber: "#TT001236",
      date: "2024-01-15",
      status: "Preparing",
      total: 280,
      items: [
        { name: "Special Biryani", quantity: 1, price: 280 },
      ],
    },
  ];

  const updateQuantity = (id: number, change: number) => {
    setCartItems(items => 
      items.map(item => 
        item.id === id 
          ? { ...item, quantity: Math.max(0, item.quantity + change) }
          : item
      ).filter(item => item.quantity > 0)
    );
  };

  const removeFromCart = (id: number) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const deliveryFee = cartTotal > 300 ? 0 : 30;
  const finalTotal = cartTotal + deliveryFee;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered": return "bg-green-500/20 text-green-400";
      case "Preparing": return "bg-yellow-500/20 text-yellow-400";
      case "Pending": return "bg-blue-500/20 text-blue-400";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen py-8 container-padding">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-gradient">My Box</h1>
          <p className="text-muted-foreground">Manage your orders and favorites</p>
        </div>

        <Tabs defaultValue="cart" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="cart" className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" />
              Cart ({cartItems.length})
            </TabsTrigger>
            <TabsTrigger value="favorites" className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              Favorites
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              History
            </TabsTrigger>
          </TabsList>

          {/* Cart Tab */}
          <TabsContent value="cart">
            {cartItems.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <ShoppingCart className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Your cart is empty</h3>
                  <p className="text-muted-foreground">Add some delicious items to get started!</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {/* Cart Items */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-4">Cart Items</h3>
                    <div className="space-y-4">
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex items-center gap-4 p-4 border border-border rounded-lg">
                          <div className="w-16 h-16 overflow-hidden rounded-lg">
                            <img 
                              src={item.image} 
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          
                          <div className="flex-1">
                            <h4 className="font-semibold">{item.name}</h4>
                            <Badge variant="secondary" className="text-xs mt-1">
                              {item.category}
                            </Badge>
                            <p className="text-primary font-semibold mt-2">₹{item.price}</p>
                          </div>

                          <div className="flex items-center gap-3">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.id, -1)}
                              className="h-8 w-8 p-0"
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="font-semibold w-8 text-center">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.id, 1)}
                              className="h-8 w-8 p-0"
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeFromCart(item.id)}
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Order Summary */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>₹{cartTotal}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Delivery Fee</span>
                        <span className={deliveryFee === 0 ? "text-green-400" : ""}>
                          {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
                        </span>
                      </div>
                      {deliveryFee === 0 && (
                        <p className="text-sm text-green-400">Free delivery on orders above ₹300!</p>
                      )}
                      <Separator className="my-2" />
                      <div className="flex justify-between text-lg font-semibold">
                        <span>Total</span>
                        <span className="text-primary">₹{finalTotal}</span>
                      </div>
                    </div>
                    <Button className="w-full mt-6 btn-hero">
                      Proceed to Checkout
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* Favorites Tab */}
          <TabsContent value="favorites">
            <div className="grid md:grid-cols-2 gap-6">
              {favoriteItems.map((item) => (
                <Card key={item.id} className="food-card">
                  <div className="aspect-square overflow-hidden relative">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                    {item.isPreOrder && (
                      <Badge className="absolute top-3 right-3 bg-accent text-accent-foreground">
                        Pre-order
                      </Badge>
                    )}
                  </div>
                  <CardContent className="p-6">
                    <Badge variant="secondary" className="mb-2">
                      {item.category}
                    </Badge>
                    <h3 className="text-xl font-semibold mb-4">{item.name}</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary">₹{item.price}</span>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Heart className="w-4 h-4 text-destructive fill-current" />
                        </Button>
                        <Button className="bg-primary hover:bg-primary/90">
                          Add to Cart
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Order History Tab */}
          <TabsContent value="history">
            <div className="space-y-4">
              {orderHistory.map((order) => (
                <Card key={order.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-semibold">{order.orderNumber}</h3>
                        <p className="text-sm text-muted-foreground">{order.date}</p>
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                        <p className="text-lg font-semibold mt-1">₹{order.total}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>{item.name} x{item.quantity}</span>
                          <span>₹{item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex items-center">
                        <RotateCcw className="w-3 h-3 mr-1" />
                        Reorder
                      </Button>
                      {order.status === "Delivered" && (
                        <Button variant="outline" size="sm">
                          Rate & Review
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Box;