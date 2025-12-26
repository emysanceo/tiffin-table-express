import { motion } from "framer-motion";
import { Utensils, Cookie, Coffee, Cake, Soup, IceCream } from "lucide-react";
import { Button } from "@/components/ui/button";

const QuickCategories = () => {
  const categories = [
    { name: "Breakfast", icon: Utensils, active: true },
    { name: "Snacks", icon: Cookie, active: false },
    { name: "Café", icon: Coffee, active: false },
    { name: "Desserts", icon: Cake, active: false },
    { name: "Meals", icon: Soup, active: false },
    { name: "Cold", icon: IceCream, active: false },
  ];

  return (
    <section className="py-4 md:py-6">
      <div className="px-4">
        <h2 className="text-lg font-semibold text-foreground mb-3">Categories</h2>
      </div>
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-2 px-4 pb-2" style={{ minWidth: 'max-content' }}>
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant={category.active ? "default" : "outline"}
                size="sm"
                className={`flex items-center gap-2 rounded-full px-4 py-2 h-auto whitespace-nowrap ${
                  category.active 
                    ? "bg-primary text-primary-foreground shadow-[var(--shadow-primary)]" 
                    : "bg-card/50 border-border/50 text-foreground hover:bg-primary/10 hover:border-primary/30"
                }`}
              >
                <category.icon className="w-4 h-4" />
                <span className="text-sm font-medium">{category.name}</span>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default QuickCategories;
