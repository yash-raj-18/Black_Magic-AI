import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';

export default function CTA() {
  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[200px]" />
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-8 glow-blue">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-bright mb-6">Ready to Turn Your Content Into<br /><span className="gradient-text">Viral Magic?</span></h2>
          <p className="text-dim text-lg max-w-xl mx-auto mb-10">Join 50,000+ creators who are automating their viral growth with Black Magic AI. Start free, no credit card required.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register" className="btn-primary text-lg !px-10 !py-4">Start Free Trial</Link>
            <Link to="/pricing" className="btn-ghost text-lg !px-10 !py-4">View Pricing</Link>
          </div>
          <p className="text-dim/50 text-sm mt-6">No credit card required. Cancel anytime.</p>
        </motion.div>
      </div>
    </section>
  );
}
