import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
import { Plus, Edit2, Trash2, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  is_available: boolean;
  is_featured: boolean;
}

const AdminMenu = () => {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<MenuItem | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Breakfast",
    is_available: true,
    is_featured: false,
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
      is_available: formData.is_available,
      is_featured: formData.is_featured,
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
      is_available: true,
      is_featured: false,
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
      is_available: item.is_available,
      is_featured: item.is_featured,
    });
    setIsDialogOpen(true);
  };

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search menu items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-card border-border/50"
          />
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground gap-2">
              <Plus className="w-4 h-4" />
              Add Item
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border max-w-md">
            <DialogHeader>
              <DialogTitle>{editItem ? "Edit Item" : "Add New Item"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Name</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="bg-input border-border/50"
                />
              </div>
              <div>
                <Label>Description</Label>
                <Input
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="bg-input border-border/50"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Price (৳)</Label>
                  <Input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                    className="bg-input border-border/50"
                  />
                </div>
                <div>
                  <Label>Category</Label>
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
              </div>
              <div className="flex items-center justify-between">
                <Label>Available</Label>
                <Switch
                  checked={formData.is_available}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_available: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Featured</Label>
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
                  {editItem ? "Update" : "Add"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
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
              transition={{ delay: index * 0.03 }}
            >
              <Card className="bg-card border-border/50">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-foreground">{item.name}</h3>
                      {item.is_featured && (
                        <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                          Featured
                        </span>
                      )}
                      {!item.is_available && (
                        <span className="text-xs bg-red-500/20 text-red-500 px-2 py-0.5 rounded-full">
                          Unavailable
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {item.category} • ৳{item.price}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
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
