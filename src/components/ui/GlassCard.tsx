import { type ReactNode } from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: 'blue' | 'pink' | 'none';
  padding?: string;
}

export default function GlassCard({ children, className = '', hover = false, glow = 'none', padding = 'p-6' }: GlassCardProps) {
  const glowClass = glow === 'blue' ? 'glow-blue' : glow === 'pink' ? 'glow-pink' : '';
  const hoverClass = hover ? 'card-hover' : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5 }}
      className={`glass rounded-2xl ${padding} ${hoverClass} ${glowClass} ${className}`}
    >
      {children}
    </motion.div>
  );
}
