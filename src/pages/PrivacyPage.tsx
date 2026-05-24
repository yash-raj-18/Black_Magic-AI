import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-bg pt-24 pb-16 relative">
      <div className="absolute inset-0 grid-pattern" />
      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-3xl font-bold text-bright mb-2">Privacy Policy</h1>
          <p className="text-dim text-sm mb-8">Last updated: May 2026</p>
          <div className="glass rounded-2xl p-8 space-y-6">
            <section><h2 className="font-display text-lg font-semibold text-bright mb-3">1. Information We Collect</h2><p className="text-dim text-sm leading-relaxed">We collect information you provide directly: account details (name, email), content you upload, connected social media account credentials, and payment information. We also collect usage data, including feature interactions, generation history, and analytics data.</p></section>
            <section><h2 className="font-display text-lg font-semibold text-bright mb-3">2. How We Use Your Information</h2><p className="text-dim text-sm leading-relaxed">Your information is used to provide and improve the Service, process transactions, send notifications, provide customer support, and improve our AI models. We do not sell your personal information to third parties.</p></section>
            <section><h2 className="font-display text-lg font-semibold text-bright mb-3">3. Content Data</h2><p className="text-dim text-sm leading-relaxed">Videos and content you upload are processed to generate AI-transformed clips. Original and transformed content is stored securely and is only accessible to you. We retain content data only as long as necessary to provide the Service or as required by law.</p></section>
            <section><h2 className="font-display text-lg font-semibold text-bright mb-3">4. Data Security</h2><p className="text-dim text-sm leading-relaxed">We implement industry-standard security measures including encryption at rest and in transit, access controls, and regular security audits. However, no system is completely secure, and we cannot guarantee absolute security.</p></section>
            <section><h2 className="font-display text-lg font-semibold text-bright mb-3">5. Your Rights</h2><p className="text-dim text-sm leading-relaxed">You have the right to access, correct, or delete your personal information. You may export your data at any time through the Settings page. Upon account deletion, your data is removed within 30 days.</p></section>
            <section><h2 className="font-display text-lg font-semibold text-bright mb-3">6. Third-Party Services</h2><p className="text-dim text-sm leading-relaxed">The Service integrates with third-party platforms (YouTube, TikTok, Instagram, etc.) for publishing. These integrations require OAuth authentication. We only access the minimum permissions necessary for publishing content on your behalf.</p></section>
          </div>
          <div className="mt-6 flex gap-4 text-sm"><Link to="/terms" className="text-primary hover:underline">Terms of Service</Link><Link to="/dmca" className="text-primary hover:underline">DMCA Policy</Link></div>
        </motion.div>
      </div>
    </div>
  );
}
