import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

const QuickCategories = () => {
  const categories = [
    { 
      name: "Breakfast", 
      icon: "🍳", 
      count: "12 items",
      gradient: "from-orange-400 to-red-400"
    },
    { 
      name: "Snacks", 
      icon: "🥪", 
      count: "18 items",
      gradient: "from-green-400 to-blue-400"
    },
    { 
      name: "Café", 
      icon: "☕", 
      count: "8 items",
      gradient: "from-purple-400 to-pink-400"
    },
  ];

  return (
    <section className="py-8 container-padding">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">Quick Access</h2>
        <div className="grid grid-cols-3 gap-4">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="card-hover cursor-pointer group">
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${category.gradient} flex items-center justify-center text-2xl group-hover:scale-110 transition-transform`}>
                    {category.icon}
                  </div>
                  <h3 className="font-semibold mb-1">{category.name}</h3>
                  <p className="text-sm text-muted-foreground">{category.count}</p>
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