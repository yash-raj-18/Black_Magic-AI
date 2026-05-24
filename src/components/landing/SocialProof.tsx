import { motion } from 'framer-motion';

const stats = [
  { value: '50K+', label: 'Creators' },
  { value: '2M+', label: 'Clips Generated' },
  { value: '500M+', label: 'Views Generated' },
  { value: '12x', label: 'Avg Engagement Boost' },
];

const testimonials = [
  { name: 'Sarah Chen', role: 'YouTube Creator, 2.1M subs', text: 'Black Magic AI transformed my long-form content strategy. I went from posting once a week to daily Shorts without extra work.', avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100' },
  { name: 'Marcus Johnson', role: 'TikTok Creator, 800K followers', text: 'The viral score prediction is scary accurate. Every clip over 90 has gone viral. This tool pays for itself in days.', avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100' },
  { name: 'Emily Rodriguez', role: 'Agency Owner, 50+ clients', text: 'Managing content for 50 clients was impossible before. Now I automate 80% of the workflow with Black Magic AI.', avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100' },
];

export default function SocialProof() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-surface/50 to-transparent" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
          {stats.map((stat) => (
            <div key={stat.label} className="glass rounded-2xl p-6 text-center card-hover">
              <p className="font-display text-3xl sm:text-4xl font-bold gradient-text mb-1">{stat.value}</p>
              <p className="text-dim text-sm">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-12">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-bright mb-4">Loved by <span className="gradient-text">Creators</span></h2>
          <p className="text-dim text-lg">See what top creators are saying about Black Magic AI.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div key={t.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }} className="glass rounded-2xl p-6 card-hover">
              <div className="flex items-center gap-3 mb-4">
                <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                <div><p className="text-sm font-semibold text-bright">{t.name}</p><p className="text-xs text-dim">{t.role}</p></div>
              </div>
              <p className="text-dim text-sm leading-relaxed">"{t.text}"</p>
              <div className="flex gap-1 mt-4">
                {Array.from({ length: 5 }).map((_, j) => (
                  <svg key={j} className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
