import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";

const FloatingActionButton = () => {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 1, type: "spring", stiffness: 260, damping: 20 }}
      className="fixed bottom-24 right-6 z-40"
    >
      <Button
        size="icon"
        className="w-14 h-14 rounded-full bg-primary hover:bg-primary/90 shadow-lg hover:shadow-glow"
      >
        <Plus className="w-6 h-6" />
      </Button>
    </motion.div>
  );
};

export default FloatingActionButton;