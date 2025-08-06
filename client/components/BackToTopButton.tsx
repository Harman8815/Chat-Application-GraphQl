import { useState, useEffect } from "react";
import { motion, useDragControls } from "framer-motion";
import { ArrowUp } from "lucide-react";

export function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const dragControls = useDragControls();

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!isVisible) return null;

  return (
    <motion.div
      drag
      dragControls={dragControls}
      dragConstraints={{ left: -200, right: 200, top: -200, bottom: 200 }}
      dragElastic={0.1}
      whileDrag={{ scale: 1.1 }}
      onDrag={(event, info) => {
        setPosition({ x: info.offset.x, y: info.offset.y });
      }}
      className="fixed bottom-8 right-8 z-50"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      style={{ x: position.x, y: position.y }}
    >
      <motion.button
        onClick={scrollToTop}
        className="w-14 h-14 rounded-full bg-gradient-to-r from-electric-blue to-neon-green text-white shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center glassmorphism border-2 border-white/20"
        whileHover={{ scale: 1.1, rotate: 360 }}
        whileTap={{ scale: 0.9 }}
        title="Back to top (draggable)"
      >
        <ArrowUp size={20} />
      </motion.button>
    </motion.div>
  );
}