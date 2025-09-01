import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, Heart, History, Calendar } from "lucide-react";
import { motion } from "framer-motion";

const UserShortcuts = () => {
  const shortcuts = [
    {
      icon: ShoppingCart,
      label: "Cart",
      count: "3",
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      icon: Heart,
      label: "Favorites",
      count: "12",
      color: "text-destructive",
      bgColor: "bg-destructive/10"
    },
    {
      icon: History,
      label: "Order History",
      count: "24",
      color: "text-secondary",
      bgColor: "bg-secondary/10"
    },
    {
      icon: Calendar,
      label: "Pre-Order",
      count: "2",
      color: "text-accent",
      bgColor: "bg-accent/10"
    }
  ];

  return (
    <section className="py-8 container-padding">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">Quick Actions</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {shortcuts.map((shortcut, index) => {
            const IconComponent = shortcut.icon;
            return (
              <motion.div
                key={shortcut.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="card-hover cursor-pointer group">
                  <CardContent className="p-6 text-center">
                    <div className={`w-12 h-12 mx-auto mb-3 rounded-full ${shortcut.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform relative`}>
                      <IconComponent className={`w-6 h-6 ${shortcut.color}`} />
                      {shortcut.count && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center font-medium">
                          {shortcut.count}
                        </div>
                      )}
                    </div>
                    <h3 className="font-medium text-sm">{shortcut.label}</h3>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default UserShortcuts;