import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Play, Sparkles, TrendingUp, Video } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      <div className="absolute inset-0 grid-pattern" />
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent/10 rounded-full blur-[120px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[200px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-8">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-dim">AI-Powered Viral Content Engine</span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }} className="font-display text-4xl sm:text-5xl md:text-7xl font-bold leading-tight mb-6">
            Turn Any Video Into<br /><span className="gradient-text">Viral Shorts</span> With AI Magic
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }} className="text-dim text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Black Magic AI automatically transforms long videos into engaging viral-ready clips optimized for YouTube Shorts, TikTok, Instagram Reels, and more.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register" className="btn-primary text-lg !px-8 !py-4">Start Free Trial</Link>
            <Link to="/register" className="btn-accent text-lg !px-8 !py-4">Generate Viral Clips</Link>
            <button className="btn-ghost text-lg !px-8 !py-4 flex items-center gap-2"><Play className="w-5 h-5" /> Watch Demo</button>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.5 }} className="relative max-w-5xl mx-auto">
          <div className="glass-strong rounded-2xl p-1 glow-blue">
            <div className="bg-surface rounded-xl p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-3 h-3 rounded-full bg-accent/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-neon-green/60" />
                <span className="ml-3 text-dim text-xs font-mono">black-magic-ai.app/dashboard</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {[
                  { label: 'Viral Score', value: '94', icon: TrendingUp, color: 'text-neon-green' },
                  { label: 'Clips Generated', value: '1,247', icon: Video, color: 'text-primary' },
                  { label: 'Engagement Rate', value: '12.4x', icon: Sparkles, color: 'text-accent' },
                ].map((stat) => (
                  <article key={stat.label} className="bg-surface-2 rounded-xl p-4 border border-border/50">
                    <div className="flex items-center gap-2 mb-2">
                      <stat.icon className={`w-4 h-4 ${stat.color}`} aria-hidden="true" />
                      <span className="text-dim text-xs">{stat.label}</span>
                    </div>
                    <span className="font-display text-2xl font-bold text-bright">{stat.value}</span>
                  </article>
                ))}
              </div>
              <div className="bg-surface-2 rounded-xl p-4 border border-border/50">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-bright">AI Processing Timeline</span>
                  <span className="text-xs text-neon-green font-medium">Live</span>
                </div>
                <div className="flex gap-1.5 h-12 items-end">
                  {Array.from({ length: 40 }).map((_, i) => {
                    const h = 15 + Math.sin(i * 0.5) * 30 + Math.random() * 40;
                    return <div key={i} className="flex-1 rounded-sm bg-gradient-to-t from-primary/60 to-primary/20" style={{ height: `${h}%` }} />;
                  })}
                </div>
              </div>
            </div>
          </div>

          <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} className="absolute -top-4 -right-4 sm:top-4 sm:right-[-60px] glass rounded-xl p-3 glow-pink">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-accent" />
              <div><p className="text-xs text-dim">Viral Score</p><p className="text-sm font-bold text-bright">98/100</p></div>
            </div>
          </motion.div>

          <motion.div animate={{ y: [0, 12, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }} className="absolute -bottom-4 -left-4 sm:bottom-8 sm:left-[-40px] glass rounded-xl p-3 glow-blue">
            <div className="flex items-center gap-2">
              <Video className="w-5 h-5 text-primary" />
              <div><p className="text-xs text-dim">Clip Ready</p><p className="text-sm font-bold text-bright">0:42s</p></div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
