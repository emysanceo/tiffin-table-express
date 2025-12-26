import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Utensils, Cookie, Coffee, ChevronRight } from "lucide-react";

const QuickCategories = () => {
  const categories = [
    { 
      name: "Breakfast", 
      icon: Utensils, 
      count: "12 items",
      description: "Start your day right",
      gradient: "from-primary/20 to-primary/5",
      iconBg: "bg-primary/20",
      iconColor: "text-primary"
    },
    { 
      name: "Snacks", 
      icon: Cookie, 
      count: "18 items",
      description: "Quick bites & treats",
      gradient: "from-secondary/20 to-secondary/5",
      iconBg: "bg-secondary/20",
      iconColor: "text-secondary"
    },
    { 
      name: "Café", 
      icon: Coffee, 
      count: "8 items",
      description: "Hot & cold beverages",
      gradient: "from-accent/20 to-accent/5",
      iconBg: "bg-accent/20",
      iconColor: "text-accent"
    },
  ];

  return (
    <section className="py-10 container-padding">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">Quick Access</h2>
            <p className="text-muted-foreground mt-1">Browse by category</p>
          </div>
          <motion.button 
            whileHover={{ x: 5 }}
            className="text-primary flex items-center gap-1 text-sm font-medium"
          >
            View All <ChevronRight className="w-4 h-4" />
          </motion.button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15, duration: 0.4 }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
            >
              <Card className={`cursor-pointer group border-border/50 bg-gradient-to-br ${category.gradient} backdrop-blur-sm overflow-hidden relative`}>
                <div className="absolute inset-0 bg-gradient-to-br from-card/80 to-card/40" />
                <CardContent className="p-6 relative z-10">
                  <div className="flex items-start justify-between">
                    <div className={`w-14 h-14 rounded-2xl ${category.iconBg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <category.icon className={`w-7 h-7 ${category.iconColor}`} />
                    </div>
                    <motion.div 
                      initial={{ opacity: 0, x: -10 }}
                      whileHover={{ opacity: 1, x: 0 }}
                      className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ChevronRight className="w-4 h-4 text-primary" />
                    </motion.div>
                  </div>
                  <h3 className="font-bold text-lg text-foreground mb-1">{category.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{category.description}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                      {category.count}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default QuickCategories;
