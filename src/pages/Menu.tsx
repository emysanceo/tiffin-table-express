import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, Search, Grid, List, Plus } from "lucide-react";
import biryaniImage from "@/assets/biryani-special.jpg";
import avocadoToastImage from "@/assets/avocado-toast.jpg";
import khichuriImage from "@/assets/khichuri-bowl.jpg";

const Menu = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const menuItems = [
    {
      id: 1,
      name: "Avocado Toast Supreme",
      description: "Fresh avocado on artisan bread with poached egg",
      price: 180,
      image: avocadoToastImage,
      category: "breakfast",
      rating: 4.8,
      isPopular: true,
      tags: ["healthy", "vegetarian"],
    },
    {
      id: 2,
      name: "Comfort Khichuri Bowl",
      description: "Traditional Bengali comfort food with lentils and rice",
      price: 140,
      image: khichuriImage,
      category: "snacks",
      rating: 4.6,
      isPopular: false,
      tags: ["comfort", "vegetarian"],
    },
    {
      id: 3,
      name: "Special Biryani",
      description: "Aromatic basmati rice with tender meat and spices",
      price: 280,
      image: biryaniImage,
      category: "cafe",
      rating: 4.9,
      isPopular: true,
      tags: ["spicy", "non-vegetarian", "pre-order"],
      preOrder: true,
    },
  ];

  const categories = [
    { value: "all", label: "All Items" },
    { value: "breakfast", label: "Breakfast 🍳" },
    { value: "snacks", label: "Snacks 🥪" },
    { value: "cafe", label: "Café ☕" },
  ];

  const filteredItems = menuItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen py-8 container-padding">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-gradient">Our Menu</h1>
          <p className="text-muted-foreground">Fresh, delicious food made with love</p>
        </div>

        {/* Search and Filters */}
        <div className="space-y-4 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              type="text"
              placeholder="Search for dishes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-input border-border"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex gap-4 w-full sm:w-auto">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-48 bg-input border-border">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="px-3"
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="px-3"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className={`${
          viewMode === "grid" 
            ? "grid md:grid-cols-2 lg:grid-cols-3 gap-6" 
            : "space-y-6"
        }`}>
          {filteredItems.map((item) => (
            <Card key={item.id} className="food-card">
              {viewMode === "grid" ? (
                <>
                  <div className="aspect-square overflow-hidden relative">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                    {item.isPopular && (
                      <Badge className="absolute top-3 left-3 bg-destructive text-destructive-foreground">
                        Popular
                      </Badge>
                    )}
                    {item.preOrder && (
                      <Badge className="absolute top-3 right-3 bg-accent text-accent-foreground">
                        Pre-order
                      </Badge>
                    )}
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary" className="capitalize">
                        {item.category}
                      </Badge>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-primary fill-current" />
                        <span className="text-sm">{item.rating}</span>
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {item.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary">₹{item.price}</span>
                      <Button className="bg-primary hover:bg-primary/90">
                        <Plus className="w-4 h-4 mr-1" />
                        Add
                      </Button>
                    </div>
                  </CardContent>
                </>
              ) : (
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="w-24 h-24 overflow-hidden rounded-lg relative flex-shrink-0">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary" className="capitalize text-xs">
                          {item.category}
                        </Badge>
                        {item.isPopular && (
                          <Badge className="bg-destructive text-destructive-foreground text-xs">
                            Popular
                          </Badge>
                        )}
                        <div className="flex items-center space-x-1 ml-auto">
                          <Star className="w-4 h-4 text-primary fill-current" />
                          <span className="text-sm">{item.rating}</span>
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold mb-1">{item.name}</h3>
                      <p className="text-muted-foreground text-sm mb-3">
                        {item.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-primary">₹{item.price}</span>
                        <Button size="sm" className="bg-primary hover:bg-primary/90">
                          <Plus className="w-3 h-3 mr-1" />
                          Add
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">No items found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu;