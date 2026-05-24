import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-bg pt-24 pb-16 relative">
      <div className="absolute inset-0 grid-pattern" />
      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-3xl font-bold text-bright mb-2">Terms of Service</h1>
          <p className="text-dim text-sm mb-8">Last updated: May 2026</p>
          <div className="glass rounded-2xl p-8 space-y-6">
            <section><h2 className="font-display text-lg font-semibold text-bright mb-3">1. Acceptance of Terms</h2><p className="text-dim text-sm leading-relaxed">By accessing or using Black Magic AI ("Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, you may not access or use the Service.</p></section>
            <section><h2 className="font-display text-lg font-semibold text-bright mb-3">2. Content Ownership and Rights</h2><p className="text-dim text-sm leading-relaxed">You represent and warrant that you own or have obtained all necessary rights, licenses, and permissions to upload, transform, and distribute any content you submit to the Service. Black Magic AI performs AI-assisted transformation of content you provide. You retain full ownership of your original content. Transformed output content is owned by you, subject to the rights in the original content.</p></section>
            <section><h2 className="font-display text-lg font-semibold text-bright mb-3">3. Fair Use and Copyright</h2><p className="text-dim text-sm leading-relaxed">The Service provides AI-assisted content transformation tools. Users are responsible for ensuring their use of the Service complies with applicable copyright laws, including fair use doctrines. Black Magic AI implements a duplicate-content warning system and requires content ownership confirmation. Unauthorized use of copyrighted material is strictly prohibited and may result in account termination.</p></section>
            <section><h2 className="font-display text-lg font-semibold text-bright mb-3">4. Acceptable Use</h2><p className="text-dim text-sm leading-relaxed">You agree not to use the Service to: create misleading or deceptive content; infringe on intellectual property rights; generate content that violates applicable laws; circumvent content protection measures; or misrepresent ownership of content.</p></section>
            <section><h2 className="font-display text-lg font-semibold text-bright mb-3">5. Subscription and Payments</h2><p className="text-dim text-sm leading-relaxed">Paid plans are billed on a recurring basis. You may cancel your subscription at any time. Refunds are provided at our discretion. Free tier usage is subject to the limits specified in your plan.</p></section>
            <section><h2 className="font-display text-lg font-semibold text-bright mb-3">6. Limitation of Liability</h2><p className="text-dim text-sm leading-relaxed">Black Magic AI is provided "as is" without warranties of any kind. We are not responsible for any content you create using the Service or its distribution. You assume full responsibility for content generated and published through the Service.</p></section>
            <section><h2 className="font-display text-lg font-semibold text-bright mb-3">7. Contact</h2><p className="text-dim text-sm leading-relaxed">For questions about these Terms, contact us at legal@blackmagicai.com.</p></section>
          </div>
          <div className="mt-6 flex gap-4 text-sm"><Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link><Link to="/dmca" className="text-primary hover:underline">DMCA Policy</Link></div>
        </motion.div>
      </div>
    </div>
  );
}
