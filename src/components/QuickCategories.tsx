import { motion } from "framer-motion";
import { Utensils, Cookie, Coffee, Cake, Soup, IceCream } from "lucide-react";
import { useNavigate } from "react-router-dom";

const QuickCategories = () => {
  const navigate = useNavigate();
  
  const categories = [
    { name: "Breakfast", icon: Utensils, color: "from-orange-500 to-amber-500" },
    { name: "Snacks", icon: Cookie, color: "from-pink-500 to-rose-500" },
    { name: "Café", icon: Coffee, color: "from-amber-600 to-yellow-500" },
    { name: "Desserts", icon: Cake, color: "from-purple-500 to-pink-500" },
    { name: "Meals", icon: Soup, color: "from-green-500 to-emerald-500" },
    { name: "Cold", icon: IceCream, color: "from-cyan-500 to-blue-500" },
  ];

  const handleCategoryClick = (category: string) => {
    navigate("/menu");
  };

  return (
    <section className="py-4">
      <div className="px-4 mb-3">
        <h2 className="text-base font-semibold text-foreground">Categories</h2>
      </div>
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-3 px-4 pb-2" style={{ minWidth: 'max-content' }}>
          {categories.map((category, index) => (
            <motion.button
              key={category.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleCategoryClick(category.name)}
              className="flex flex-col items-center gap-1.5"
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center shadow-md`}>
                <category.icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-medium text-foreground/80">{category.name}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default QuickCategories;
