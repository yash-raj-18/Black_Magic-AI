import { motion } from 'framer-motion';
import GlassCard from '../ui/GlassCard';
import { Sparkles, Captions, Type, Mic, Crop, ZoomIn, Share2, TrendingUp, BarChart3, Image, Hash, Globe, Calendar, Eye } from 'lucide-react';

const features = [
  { icon: Sparkles, title: 'AI Viral Clip Detection', desc: 'Automatically identifies the most engaging moments using advanced AI models.', color: 'text-primary' },
  { icon: Captions, title: 'Auto Captions', desc: 'Generate perfectly timed captions with customizable styles for accessibility.', color: 'text-accent' },
  { icon: Type, title: 'AI Hooks & Titles', desc: 'Craft attention-grabbing hooks and titles optimized for each platform.', color: 'text-neon-green' },
  { icon: Mic, title: 'AI Voiceovers', desc: 'Generate natural-sounding voiceovers in multiple voices and languages.', color: 'text-primary' },
  { icon: Crop, title: 'Smart Reframing', desc: 'Automatically crop and reframing for 9:16 vertical format.', color: 'text-accent' },
  { icon: ZoomIn, title: 'Auto Zoom Effects', desc: 'Dynamic zoom effects that highlight key moments and maintain attention.', color: 'text-neon-green' },
  { icon: Share2, title: 'Social Media Automation', desc: 'Auto-publish to YouTube, TikTok, Instagram, and more.', color: 'text-primary' },
  { icon: TrendingUp, title: 'Trend Prediction', desc: 'AI analyzes current trends to optimize your content for virality.', color: 'text-accent' },
  { icon: BarChart3, title: 'Viral Score Analysis', desc: 'Real-time scoring system predicts content performance before you publish.', color: 'text-neon-green' },
  { icon: Image, title: 'AI Thumbnail Generator', desc: 'Create eye-catching thumbnails that drive clicks automatically.', color: 'text-primary' },
  { icon: Hash, title: 'Hashtag Generator', desc: 'Generate optimized hashtags for each platform to maximize discoverability.', color: 'text-accent' },
  { icon: Globe, title: 'Multi-language Support', desc: 'Translate and localize your content for global audiences.', color: 'text-neon-green' },
  { icon: Calendar, title: 'Automatic Scheduling', desc: 'AI determines optimal posting times and schedules content.', color: 'text-primary' },
  { icon: Eye, title: 'Engagement Analytics', desc: 'Track views, likes, shares, and retention rates across platforms.', color: 'text-accent' },
];

export default function Features() {
  return (
    <section id="features" className="relative py-24 sm:py-32">
      <div className="absolute inset-0 grid-pattern" />
      <div className="absolute top-0 left-1/4 w-80 h-80 bg-primary/5 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-[100px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-16">
          <span className="inline-block text-primary text-sm font-semibold tracking-wider uppercase mb-4">Powerful Features</span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-bright mb-4">Everything You Need to Go <span className="gradient-text">Viral</span></h2>
          <p className="text-dim text-lg max-w-2xl mx-auto">14 AI-powered tools that automate every step of your viral content creation pipeline.</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {features.map((feature, i) => (
            <GlassCard key={feature.title} hover className="group" padding="p-5">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.05 }}>
                <div className={`w-10 h-10 rounded-xl bg-surface-2 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className={`w-5 h-5 ${feature.color}`} aria-hidden="true" />
                </div>
                <h3 className="font-display font-semibold text-bright text-sm mb-2">{feature.title}</h3>
                <p className="text-dim text-xs leading-relaxed">{feature.desc}</p>
              </motion.div>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}
