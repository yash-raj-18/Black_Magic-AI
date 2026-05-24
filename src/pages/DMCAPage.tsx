import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function DMCAPage() {
  return (
    <div className="min-h-screen bg-bg pt-24 pb-16 relative">
      <div className="absolute inset-0 grid-pattern" />
      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-3xl font-bold text-bright mb-2">DMCA Policy</h1>
          <p className="text-dim text-sm mb-8">Last updated: May 2026</p>
          <div className="glass rounded-2xl p-8 space-y-6">
            <section><h2 className="font-display text-lg font-semibold text-bright mb-3">1. Copyright Notice</h2><p className="text-dim text-sm leading-relaxed">Black Magic AI respects the intellectual property rights of others and expects its users to do the same. We respond to notices of alleged copyright infringement that comply with the Digital Millennium Copyright Act (DMCA).</p></section>
            <section><h2 className="font-display text-lg font-semibold text-bright mb-3">2. Content Ownership Requirement</h2><p className="text-dim text-sm leading-relaxed">All users must confirm they own or have legal rights to content before uploading. Our duplicate-content warning system helps identify potentially infringing content. Users who repeatedly violate copyright may have their accounts terminated.</p></section>
            <section><h2 className="font-display text-lg font-semibold text-bright mb-3">3. Filing a DMCA Takedown Notice</h2><p className="text-dim text-sm leading-relaxed">If you believe your copyrighted work is being used without authorization, please provide:</p><ul className="text-dim text-sm leading-relaxed list-disc ml-6 mt-2 space-y-1"><li>A description of the copyrighted work you claim has been infringed</li><li>A description of where the infringing material is located on the Service</li><li>Your address, phone number, and email address</li><li>A statement that you have a good faith belief that the use is not authorized</li><li>A statement, under penalty of perjury, that the information is accurate and you are authorized to act on behalf of the copyright owner</li><li>Your physical or electronic signature</li></ul></section>
            <section><h2 className="font-display text-lg font-semibold text-bright mb-3">4. Counter-Notice</h2><p className="text-dim text-sm leading-relaxed">If you believe your content was removed in error, you may file a counter-notice with the required information under the DMCA. Upon receipt of a valid counter-notice, we will restore the removed content within 10-14 business days unless the original notifier files a court action.</p></section>
            <section><h2 className="font-display text-lg font-semibold text-bright mb-3">5. Fair Use Disclaimer</h2><p className="text-dim text-sm leading-relaxed">Black Magic AI provides AI-assisted transformation tools. Users are responsible for ensuring their use falls within fair use or that they have obtained necessary permissions. The Service includes safeguards to promote lawful content transformation, but does not guarantee compliance with all applicable copyright laws.</p></section>
            <section><h2 className="font-display text-lg font-semibold text-bright mb-3">6. Contact for DMCA Notices</h2><p className="text-dim text-sm leading-relaxed">Send DMCA notices to: dmca@blackmagicai.com</p></section>
          </div>
          <div className="mt-6 flex gap-4 text-sm"><Link to="/terms" className="text-primary hover:underline">Terms of Service</Link><Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link></div>
        </motion.div>
      </div>
    </div>
  );
}
