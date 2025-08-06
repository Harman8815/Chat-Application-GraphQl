import { motion } from "framer-motion";

export function LoadingSpinner() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <div className="relative">
        {/* Animated background gradient */}
        <div className="absolute inset-0 gradient-bg opacity-20 rounded-full animate-pulse"></div>
        
        {/* Main spinner */}
        <motion.div
          className="w-16 h-16 border-4 border-electric-blue/30 border-t-electric-blue rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Floating dots around spinner */}
        <div className="absolute inset-0 flex items-center justify-center">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-neon-green rounded-full"
              style={{
                transform: `rotate(${i * 60}deg) translateY(-24px)`,
              }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </div>
      
      {/* Loading text */}
      <motion.div
        className="absolute mt-32 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <motion.h2
          className="text-2xl font-bold text-gradient mb-2"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Loading ChatLink
        </motion.h2>
        <p className="text-muted-foreground">Preparing your chat experience...</p>
      </motion.div>
    </div>
  );
}