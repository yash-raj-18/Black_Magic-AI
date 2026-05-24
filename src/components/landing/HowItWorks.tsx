import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Youtube, Upload, Wand2, Share2 } from 'lucide-react';

const steps = [
  { icon: Youtube, title: 'Paste YouTube Link', desc: 'Drop any YouTube URL, upload a video file, or paste a transcript.', color: 'text-red-500' },
  { icon: Wand2, title: 'AI Processes Video', desc: 'Our AI transcribes, detects viral moments, generates hooks and captions.', color: 'text-primary' },
  { icon: Upload, title: 'Review & Edit Clips', desc: 'Preview generated clips, adjust captions, fine-tune hooks.', color: 'text-accent' },
  { icon: Share2, title: 'Auto-Publish Everywhere', desc: 'One click publishes to all your connected platforms at optimal times.', color: 'text-neon-green' },
];

export default function HowItWorks() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="absolute inset-0 grid-pattern" />
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px]" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-16">
          <span className="inline-block text-primary text-sm font-semibold tracking-wider uppercase mb-4">How It Works</span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-bright mb-4">From Long Video to <span className="gradient-text">Viral Clip</span> in Minutes</h2>
          <p className="text-dim text-lg max-w-2xl mx-auto">Four simple steps. Zero video editing skills required.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <motion.div key={step.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.15 }} className="relative">
              <div className="glass rounded-2xl p-6 card-hover h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-surface-2 flex items-center justify-center"><step.icon className={`w-6 h-6 ${step.color}`} /></div>
                  <span className="font-display text-3xl font-bold text-border">{i + 1}</span>
                </div>
                <h3 className="font-display font-semibold text-bright mb-2">{step.title}</h3>
                <p className="text-dim text-sm leading-relaxed">{step.desc}</p>
              </div>
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 text-border">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.6 }} className="text-center mt-12">
          <Link to="/register" className="btn-primary text-lg !px-10 !py-4 inline-block">Start Creating Viral Clips Now</Link>
        </motion.div>
      </div>
    </section>
  );
}
