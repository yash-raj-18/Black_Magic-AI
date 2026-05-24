import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-bg border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-lg text-bright">Black Magic AI</span>
            </Link>
            <p className="text-dim text-sm leading-relaxed">Transform long videos into viral short-form content with AI-powered automation.</p>
          </div>
          <div>
            <h4 className="font-display font-semibold text-bright mb-4 text-sm">Product</h4>
            <ul className="space-y-2">
              <li><Link to="/pricing" className="text-dim hover:text-primary transition-colors text-sm">Pricing</Link></li>
              <li><a href="#features" className="text-dim hover:text-primary transition-colors text-sm">Features</a></li>
              <li><Link to="/dashboard" className="text-dim hover:text-primary transition-colors text-sm">Dashboard</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-display font-semibold text-bright mb-4 text-sm">Legal</h4>
            <ul className="space-y-2">
              <li><Link to="/terms" className="text-dim hover:text-primary transition-colors text-sm">Terms of Service</Link></li>
              <li><Link to="/privacy" className="text-dim hover:text-primary transition-colors text-sm">Privacy Policy</Link></li>
              <li><Link to="/dmca" className="text-dim hover:text-primary transition-colors text-sm">DMCA Policy</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-display font-semibold text-bright mb-4 text-sm">Company</h4>
            <ul className="space-y-2">
              <li><span className="text-dim text-sm">About</span></li>
              <li><span className="text-dim text-sm">Blog</span></li>
              <li><span className="text-dim text-sm">Contact</span></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-dim text-sm">&copy; 2026 Black Magic AI. All rights reserved.</p>
          <p className="text-dim/50 text-xs">AI-assisted content transformation requires user content ownership confirmation.</p>
        </div>
      </div>
    </footer>
  );
}
