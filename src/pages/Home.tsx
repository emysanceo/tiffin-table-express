import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, Utensils } from "lucide-react";
import heroImage from "@/assets/hero-breakfast.jpg";
import biryaniImage from "@/assets/biryani-special.jpg";
import avocadoToastImage from "@/assets/avocado-toast.jpg";
import khichuriImage from "@/assets/khichuri-bowl.jpg";

const Home = () => {
  const todaysSpecials = [
    {
      id: 1,
      name: "Avocado Toast Supreme",
      price: "₹180",
      image: avocadoToastImage,
      category: "Breakfast",
      rating: 4.8,
    },
    {
      id: 2,
      name: "Comfort Khichuri Bowl",
      price: "₹140",
      image: khichuriImage,
      category: "Snacks",
      rating: 4.6,
    },
  ];

  const preOrderItems = [
    {
      name: "Special Biryani",
      price: "₹280",
      image: biryaniImage,
      preOrderDays: "2 days",
      category: "Pre-order",
    },
  ];

  const categories = [
    { name: "Breakfast", icon: "🍳", count: "12 items" },
    { name: "Snacks", icon: "🥪", count: "18 items" },
    { name: "Café", icon: "☕", count: "8 items" },
  ];

  const reviews = [
    {
      name: "Priya Sharma",
      rating: 5,
      comment: "Amazing breakfast! The avocado toast was perfect.",
      time: "2 hours ago",
    },
    {
      name: "Rahul Gupta",
      rating: 5,
      comment: "Best khichuri in the city. Comfort food at its finest!",
      time: "1 day ago",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        className="relative h-screen flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `linear-gradient(rgba(24, 24, 18, 0.7), rgba(24, 24, 18, 0.7)), url(${heroImage})` }}
      >
        <div className="text-center container-padding">
          <Badge className="mb-4 bg-secondary text-secondary-foreground">
            Fresh • Local • Delicious
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gradient leading-tight">
            Tiffin Table
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-muted-foreground max-w-2xl mx-auto">
            Your neighborhood café for breakfast, snacks, and comfort food that feels like home
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="btn-hero">
              Order Now
            </Button>
            <Button variant="outline" className="btn-ghost">
              View Menu
            </Button>
          </div>
        </div>
      </section>

      {/* Today's Specials */}
      <section className="py-16 container-padding">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Today's Specials</h2>
            <Badge className="bg-destructive text-destructive-foreground">
              Limited Time
            </Badge>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {todaysSpecials.map((item) => (
              <Card key={item.id} className="food-card">
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary">{item.category}</Badge>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-primary fill-current" />
                      <span className="text-sm">{item.rating}</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary">{item.price}</span>
                    <Button className="bg-primary hover:bg-primary/90">
                      Add to Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-muted/20 container-padding">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Browse Categories</h2>
          <div className="grid grid-cols-3 gap-4">
            {categories.map((category) => (
              <Card key={category.name} className="card-hover cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-4">{category.icon}</div>
                  <h3 className="font-semibold mb-2">{category.name}</h3>
                  <p className="text-sm text-muted-foreground">{category.count}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pre-Order Highlights */}
      <section className="py-16 container-padding">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">Pre-Order Specials</h2>
          <div className="grid lg:grid-cols-3 gap-6">
            {preOrderItems.map((item, index) => (
              <Card key={index} className="food-card">
                <div className="aspect-square overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <Badge className="mb-2 bg-accent text-accent-foreground">
                    <Clock className="w-3 h-3 mr-1" />
                    {item.preOrderDays} advance
                  </Badge>
                  <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary">{item.price}</span>
                    <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                      Pre-Order
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Reviews */}
      <section className="py-16 bg-muted/20 container-padding">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">What Our Customers Say</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {reviews.map((review, index) => (
              <Card key={index} className="community-post">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center mr-3">
                    <span className="text-primary-foreground font-semibold">
                      {review.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold">{review.name}</h4>
                    <div className="flex items-center">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-primary fill-current" />
                      ))}
                      <span className="text-sm text-muted-foreground ml-2">{review.time}</span>
                    </div>
                  </div>
                </div>
                <p className="text-muted-foreground">{review.comment}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;