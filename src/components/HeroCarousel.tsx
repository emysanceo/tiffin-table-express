import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import heroImage from "@/assets/hero-breakfast.jpg";
import avocadoImage from "@/assets/avocado-toast.jpg";
import khichuriImage from "@/assets/khichuri-bowl.jpg";

const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: heroImage,
      title: "Today's Breakfast Special",
      subtitle: "Hot Paratha & Sabji – Fresh & Delicious",
      cta: "Order Now"
    },
    {
      image: avocadoImage,
      title: "Café Vibes",
      subtitle: "Fresh Brewed Coffee ☕ Available Now",
      cta: "Order Coffee"
    },
    {
      image: khichuriImage,
      title: "Weekly Promo",
      subtitle: "20% Off on Snacks – This Week Only!",
      cta: "Shop Snacks"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="relative h-[40vh] md:h-[60vh] lg:h-[70vh] overflow-hidden rounded-2xl mx-4 md:mx-6 lg:mx-8 mt-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -300 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <div
            className="w-full h-full bg-cover bg-center relative"
            style={{
              backgroundImage: `linear-gradient(rgba(24, 24, 18, 0.6), rgba(24, 24, 18, 0.6)), url(${slides[currentSlide].image})`
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center text-center container-padding">
              <div className="max-w-2xl">
                <motion.h1 
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-3xl md:text-5xl font-bold mb-4 text-gradient"
                >
                  {slides[currentSlide].title}
                </motion.h1>
                <motion.p 
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-lg md:text-xl mb-8 text-muted-foreground"
                >
                  {slides[currentSlide].subtitle}
                </motion.p>
                <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <Button className="btn-hero text-lg px-8 py-3">
                    {slides[currentSlide].cta}
                  </Button>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <Button
        variant="ghost"
        size="icon"
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white border-none"
      >
        <ChevronLeft className="w-6 h-6" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white border-none"
      >
        <ChevronRight className="w-6 h-6" />
      </Button>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide ? "bg-primary" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;