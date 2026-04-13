"use client";

import { motion } from "framer-motion";
import { cn } from "../../../lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  hover?: boolean;
}

export function GlassCard({ children, className, delay = 0, hover = true }: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.8, 
        delay, 
        ease: [0.16, 1, 0.3, 1] 
      }}
      whileHover={hover ? { 
        y: -5, 
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        borderColor: "rgba(255, 255, 255, 0.2)"
      } : {}}
      className={cn(
        "glass rounded-3xl p-6 transition-all duration-300",
        className
      )}
    >
      {children}
    </motion.div>
  );
}
