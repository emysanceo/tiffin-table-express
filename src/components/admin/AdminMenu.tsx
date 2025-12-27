import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Edit2, Trash2, Search, Image, Package, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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

const AdminMenu = () => {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<MenuItem | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Breakfast",
    image_url: "",
    is_available: true,
    is_featured: false,
    stock: "100",
  });

  const categories = ["Breakfast", "Snacks", "Café"];

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const { data, error } = await supabase
      .from("menu_items")
      .select("*")
      .order("category", { ascending: true });

    if (error) {
      toast.error("Failed to load menu items");
    } else {
      setItems(data || []);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const itemData = {
      name: formData.name,
      description: formData.description || null,
      price: parseFloat(formData.price),
      category: formData.category,
      image_url: formData.image_url || null,
      is_available: formData.is_available,
      is_featured: formData.is_featured,
      stock: parseInt(formData.stock) || 100,
    };

    if (editItem) {
      const { error } = await supabase
        .from("menu_items")
        .update(itemData)
        .eq("id", editItem.id);

      if (error) {
        toast.error("Failed to update item");
      } else {
        toast.success("Item updated successfully");
        fetchItems();
      }
    } else {
      const { error } = await supabase.from("menu_items").insert(itemData);

      if (error) {
        toast.error("Failed to add item");
      } else {
        toast.success("Item added successfully");
        fetchItems();
      }
    }

    resetForm();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    
    const { error } = await supabase.from("menu_items").delete().eq("id", id);

    if (error) {
      toast.error("Failed to delete item");
    } else {
      toast.success("Item deleted");
      fetchItems();
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "Breakfast",
      image_url: "",
      is_available: true,
      is_featured: false,
      stock: "100",
    });
    setEditItem(null);
    setIsDialogOpen(false);
  };

  const openEditDialog = (item: MenuItem) => {
    setEditItem(item);
    setFormData({
      name: item.name,
      description: item.description || "",
      price: item.price.toString(),
      category: item.category,
      image_url: item.image_url || "",
      is_available: item.is_available ?? true,
      is_featured: item.is_featured ?? false,
      stock: (item.stock ?? 100).toString(),
    });
    setIsDialogOpen(true);
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const lowStockItems = items.filter(item => (item.stock ?? 100) <= 10);

  return (
    <div className="space-y-4">
      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <Card className="bg-destructive/10 border-destructive/30">
          <CardContent className="p-3 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-destructive" />
            <span className="text-sm text-destructive">
              {lowStockItems.length} item(s) low on stock
            </span>
          </CardContent>
        </Card>
      )}

      {/* Header */}
      <div className="flex flex-col gap-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search menu items..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-card border-border/50"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-32 bg-card border-border/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full bg-primary text-primary-foreground gap-2">
              <Plus className="w-4 h-4" />
              Add New Item
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editItem ? "Edit Item" : "Add New Item"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Name *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="e.g. Chicken Biryani"
                  className="bg-input border-border/50"
                />
              </div>
              
              <div>
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your dish..."
                  className="bg-input border-border/50 resize-none"
                  rows={2}
                />
              </div>

              <div>
                <Label>Image URL</Label>
                <div className="flex gap-2">
                  <Input
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                    className="bg-input border-border/50"
                  />
                </div>
                {formData.image_url && (
                  <div className="mt-2 rounded-lg overflow-hidden w-20 h-20">
                    <img 
                      src={formData.image_url} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                      onError={(e) => (e.currentTarget.style.display = 'none')}
                    />
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Price (৳) *</Label>
                  <Input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                    min="0"
                    placeholder="0"
                    className="bg-input border-border/50"
                  />
                </div>
                <div>
                  <Label>Stock</Label>
                  <Input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    min="0"
                    placeholder="100"
                    className="bg-input border-border/50"
                  />
                </div>
              </div>

              <div>
                <Label>Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger className="bg-input border-border/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-muted-foreground" />
                  <Label className="cursor-pointer">Available</Label>
                </div>
                <Switch
                  checked={formData.is_available}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_available: checked })}
                />
              </div>
              
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm">⭐</span>
                  <Label className="cursor-pointer">Featured</Label>
                </div>
                <Switch
                  checked={formData.is_featured}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
                />
              </div>
              
              <div className="flex gap-2 pt-2">
                <Button type="button" variant="outline" onClick={resetForm} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" className="flex-1 bg-primary text-primary-foreground">
                  {editItem ? "Update" : "Add Item"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2">
        <Card className="bg-card border-border/50">
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold text-foreground">{items.length}</p>
            <p className="text-xs text-muted-foreground">Total Items</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border/50">
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold text-primary">{items.filter(i => i.is_available).length}</p>
            <p className="text-xs text-muted-foreground">Available</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border/50">
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold text-destructive">{lowStockItems.length}</p>
            <p className="text-xs text-muted-foreground">Low Stock</p>
          </CardContent>
        </Card>
      </div>

      {/* Items List */}
      <div className="space-y-2">
        {loading ? (
          <div className="text-center py-8 text-muted-foreground">Loading...</div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No items found</div>
        ) : (
          filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.02 }}
            >
              <Card className="bg-card border-border/50 overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex items-center gap-3">
                    {/* Thumbnail */}
                    <div className="w-16 h-16 bg-muted flex-shrink-0 flex items-center justify-center">
                      {item.image_url ? (
                        <img 
                          src={item.image_url} 
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Image className="w-6 h-6 text-muted-foreground/50" />
                      )}
                    </div>
                    
                    {/* Info */}
                    <div className="flex-1 py-2 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h3 className="font-medium text-foreground text-sm truncate">{item.name}</h3>
                        {item.is_featured && (
                          <span className="text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded-full">
                            Featured
                          </span>
                        )}
                        {!item.is_available && (
                          <span className="text-[10px] bg-destructive/20 text-destructive px-1.5 py-0.5 rounded-full">
                            Unavailable
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {item.category} • ৳{item.price} • Stock: {item.stock ?? 100}
                      </p>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center gap-1 pr-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(item)}
                        className="h-8 w-8"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(item.id)}
                        className="h-8 w-8 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminMenu;
